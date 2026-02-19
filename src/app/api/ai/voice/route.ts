import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Simple intent detection without external AI API
function detectIntent(query: string): { intent: string; params: any } {
  const lower = query.toLowerCase();
  
  // Check-in / practice queries
  if (lower.includes("practice") || lower.includes("check") || lower.includes("train") || lower.includes("ćwicz") || lower.includes("trening")) {
    if (lower.includes("last week") || lower.includes("zeszły tydzień") || lower.includes("tydzień")) {
      return { intent: "CHECKINS_LAST_WEEK", params: {} };
    }
    if (lower.includes("this month") || lower.includes("ten miesiąc") || lower.includes("miesiąc")) {
      return { intent: "CHECKINS_THIS_MONTH", params: {} };
    }
    if (lower.includes("total") || lower.includes("wszystkie")) {
      return { intent: "CHECKINS_TOTAL", params: {} };
    }
    return { intent: "CHECKINS_RECENT", params: {} };
  }
  
  // Streak queries
  if (lower.includes("streak") || lower.includes("seria") || lower.includes("z rzędu")) {
    return { intent: "STREAK", params: {} };
  }
  
  // Token queries
  if (lower.includes("token") || lower.includes("dojo") || lower.includes("points") || lower.includes("punkt")) {
    return { intent: "TOKENS", params: {} };
  }
  
  // Belt/rank queries
  if (lower.includes("belt") || lower.includes("rank") || lower.includes("pas") || lower.includes("stopień")) {
    return { intent: "BELT_STATUS", params: {} };
  }
  
  // Class schedule queries
  if (lower.includes("class") || lower.includes("next") || lower.includes("when") || lower.includes("zajęcia") || lower.includes("kiedy")) {
    return { intent: "NEXT_CLASS", params: {} };
  }
  
  // Leaderboard queries
  if (lower.includes("leaderboard") || lower.includes("ranking") || lower.includes("miejsce")) {
    return { intent: "LEADERBOARD", params: {} };
  }
  
  return { intent: "UNKNOWN", params: {} };
}

export async function POST(request: NextRequest) {
  try {
    const { query, studentId, language } = await request.json();

    if (!query || !studentId) {
      return NextResponse.json(
        { error: "Query and studentId required" },
        { status: 400 }
      );
    }

    const { intent } = detectIntent(query);
    const isPolish = language === "pl" || detectLanguage(query) === "pl";

    // Fetch student data
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        dojo: {
          include: {
            classes: {
              include: { instructor: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    let response = "";
    let data = null;

    switch (intent) {
      case "CHECKINS_LAST_WEEK": {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const checkIns = await prisma.checkIn.findMany({
          where: {
            studentId,
            checkedInAt: { gte: oneWeekAgo },
          },
          orderBy: { checkedInAt: "desc" },
        });

        data = { count: checkIns.length, checkIns };
        
        if (isPolish) {
          response = `W zeszłym tygodniu trenowałeś ${checkIns.length} razy.`;
          if (checkIns.length > 0) {
            const days = checkIns.map(c => 
              new Date(c.checkedInAt).toLocaleDateString("pl-PL", { weekday: "long" })
            ).join(", ");
            response += ` Byłeś w dojo w dni: ${days}.`;
          }
        } else {
          response = `You practiced ${checkIns.length} times last week.`;
          if (checkIns.length > 0) {
            const days = checkIns.map(c => 
              new Date(c.checkedInAt).toLocaleDateString("en-US", { weekday: "long" })
            ).join(", ");
            response += ` You trained on: ${days}.`;
          }
        }
        break;
      }

      case "CHECKINS_THIS_MONTH": {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const count = await prisma.checkIn.count({
          where: {
            studentId,
            checkedInAt: { gte: startOfMonth },
          },
        });

        data = { count };
        response = isPolish
          ? `W tym miesiącu trenowałeś ${count} razy.`
          : `You've practiced ${count} times this month.`;
        break;
      }

      case "CHECKINS_TOTAL": {
        const total = await prisma.checkIn.count({ where: { studentId } });
        data = { total };
        response = isPolish
          ? `Od początku trenowałeś ${total} razy.`
          : `You've trained ${total} times total.`;
        break;
      }

      case "STREAK": {
        // Calculate current streak
        const checkIns = await prisma.checkIn.findMany({
          where: { studentId },
          orderBy: { checkedInAt: "desc" },
          take: 30,
        });

        let streak = 0;
        const oneDay = 24 * 60 * 60 * 1000;
        
        for (let i = 0; i < checkIns.length; i++) {
          if (i === 0) {
            streak = 1;
          } else {
            const diff = checkIns[i - 1].checkedInAt.getTime() - checkIns[i].checkedInAt.getTime();
            if (diff <= oneDay * 2) {
              streak++;
            } else {
              break;
            }
          }
        }

        data = { streak };
        response = isPolish
          ? `Twoja obecna seria to ${streak} dni.`
          : `Your current streak is ${streak} days.`;
        break;
      }

      case "TOKENS": {
        data = { balance: student.dojoBalance, total: student.totalEarned };
        response = isPolish
          ? `Masz ${student.dojoBalance} DOJO tokenów. Łącznie zdobyłeś ${student.totalEarned}.`
          : `You have ${student.dojoBalance} DOJO tokens. You've earned ${student.totalEarned} total.`;
        break;
      }

      case "BELT_STATUS": {
        data = { belt: student.beltRank, stripes: student.stripes };
        response = isPolish
          ? `Jesteś na ${student.beltRank.toLowerCase()} pasie z ${student.stripes} kreskami.`
          : `You're a ${student.beltRank.toLowerCase()} belt with ${student.stripes} stripes.`;
        break;
      }

      case "NEXT_CLASS": {
        const classes = student.dojo.classes;
        data = { classes };
        response = isPolish
          ? `Masz ${classes.length} zajęć w tym tygodniu. Sprawdź grafik w aplikacji.`
          : `You have ${classes.length} classes this week. Check the schedule in the app.`;
        break;
      }

      case "LEADERBOARD": {
        const entry = await prisma.leaderboardEntry.findFirst({
          where: { studentId },
          orderBy: { createdAt: "desc" },
        });
        
        if (entry?.rank) {
          data = { rank: entry.rank, score: entry.totalScore };
          response = isPolish
            ? `Jesteś na ${entry.rank} miejscu w rankingu z ${entry.totalScore} punktami.`
            : `You're ranked #${entry.rank} on the leaderboard with ${entry.totalScore} points.`;
        } else {
          response = isPolish
            ? "Jeszcze nie ma cię w rankingu. Trenuj więcej!"
            : "You're not on the leaderboard yet. Keep training!";
        }
        break;
      }

      default: {
        response = isPolish
          ? "Przepraszam, nie rozumiem. Spróbuj zapytać o treningi, serię, tokeny lub pas."
          : "Sorry, I didn't understand. Try asking about your practice, streak, tokens, or belt.";
      }
    }

    return NextResponse.json({
      intent,
      response,
      data,
      language: isPolish ? "pl" : "en",
    });
  } catch (error) {
    console.error("Voice AI error:", error);
    return NextResponse.json(
      { error: "Failed to process voice query" },
      { status: 500 }
    );
  }
}

function detectLanguage(text: string): string {
  const polishChars = /[ąćęłńóśźż]/i;
  return polishChars.test(text) ? "pl" : "en";
}
