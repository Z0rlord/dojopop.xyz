import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Leaderboard } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dojoId = searchParams.get("dojoId");
    const month = searchParams.get("month"); // Format: "2026-02"

    if (!dojoId) {
      return NextResponse.json(
        { error: "dojoId required" },
        { status: 400 }
      );
    }

    // Get current or specified month's leaderboard
    const targetMonth = month || new Date().toISOString().slice(0, 7);

    let leaderboard: Leaderboard | null = await prisma.leaderboard.findFirst({
      where: {
        dojoId,
        month: targetMonth,
      },
      include: {
        entries: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                beltRank: true,
              },
            },
          },
          orderBy: {
            totalScore: "desc",
          },
          take: 100,
        },
      },
    });

    // Create leaderboard if doesn't exist
    if (!leaderboard) {
      const [year, monthNum] = targetMonth.split("-").map(Number);
      leaderboard = await prisma.leaderboard.create({
        data: {
          dojoId,
          month: targetMonth,
          year,
          name: `${new Date(year, monthNum - 1).toLocaleString("default", { month: "long" })} ${year} Leaderboard`,
          prizePool: 1000, // Default prize pool
        },
        include: {
          entries: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  beltRank: true,
                },
              },
            },
            orderBy: {
              totalScore: "desc",
            },
          },
        },
      });
    }

    // Add ranks
    const entriesWithRanks = leaderboard.entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return NextResponse.json({
      leaderboard: {
        ...leaderboard,
        entries: entriesWithRanks,
      },
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

// Recalculate leaderboard scores
export async function POST(request: NextRequest) {
  try {
    const { leaderboardId } = await request.json();

    const leaderboard = await prisma.leaderboard.findUnique({
      where: { id: leaderboardId },
      include: {
        dojo: {
          include: {
            students: {
              include: {
                checkIns: {
                  where: {
                    checkedInAt: {
                      gte: new Date(`${leaderboard.month}-01`),
                      lt: new Date(`${leaderboard.month}-31`),
                    },
                  },
                },
                videos: {
                  where: {
                    recordedAt: {
                      gte: new Date(`${leaderboard.month}-01`),
                      lt: new Date(`${leaderboard.month}-31`),
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!leaderboard) {
      return NextResponse.json(
        { error: "Leaderboard not found" },
        { status: 404 }
      );
    }

    // Calculate scores for each student
    for (const student of leaderboard.dojo.students) {
      const checkIns = student.checkIns.length;
      const videos = student.videos.length;
      
      // Calculate streak (simplified)
      const streak = calculateStreak(student.checkIns);
      
      // Score formula: check-ins + (streak * 2) + (videos * 5)
      const totalScore = checkIns + (streak * 2) + (videos * 5);

      await prisma.leaderboardEntry.upsert({
        where: {
          leaderboardId_studentId: {
            leaderboardId: leaderboard.id,
            studentId: student.id,
          },
        },
        create: {
          leaderboardId: leaderboard.id,
          studentId: student.id,
          checkIns,
          streak,
          videos,
          totalScore,
        },
        update: {
          checkIns,
          streak,
          videos,
          totalScore,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Recalculate leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to recalculate" },
      { status: 500 }
    );
  }
}

function calculateStreak(checkIns: { checkedInAt: Date }[]): number {
  if (checkIns.length === 0) return 0;
  
  // Sort by date descending
  const sorted = [...checkIns].sort((a, b) => 
    b.checkedInAt.getTime() - a.checkedInAt.getTime()
  );
  
  let streak = 1;
  const oneDay = 24 * 60 * 60 * 1000;
  
  for (let i = 1; i < sorted.length; i++) {
    const diff = sorted[i - 1].checkedInAt.getTime() - sorted[i].checkedInAt.getTime();
    if (diff <= oneDay * 2) { // Within 2 days (allows for missed day)
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
