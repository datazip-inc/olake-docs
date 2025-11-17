// Supabase Edge Function to fetch gamification leaderboard with GitHub token
// This avoids rate limits by using authenticated requests

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");
    const ORG = Deno.env.get("ORG") || "datazip-inc";
    const REPO = Deno.env.get("REPO") || "olake";

    if (!GITHUB_TOKEN) {
      return new Response(JSON.stringify({
        error: "GITHUB_TOKEN not configured"
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Fetching leaderboard data from GitHub...');

    const headers = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    // Fetch closed "good first issue" issues
    console.log('📡 Fetching closed "good first issue" issues...');
    const goodFirstRes = await fetch(
      `https://api.github.com/repos/${ORG}/${REPO}/issues?state=closed&labels=good first issue&per_page=100`,
      { headers }
    );
    const goodFirstIssues = await goodFirstRes.json();
    console.log(`✅ Found ${Array.isArray(goodFirstIssues) ? goodFirstIssues.length : 0} closed "good first issue" issues`);
    
    if (Array.isArray(goodFirstIssues) && goodFirstIssues.length > 0) {
      console.log('Sample good first issues:', goodFirstIssues.slice(0, 3).map(i => `#${i.number}: ${i.title.substring(0, 50)}...`));
    }

    // Fetch closed "good second issue" issues
    console.log('📡 Fetching closed "good second issue" issues...');
    const goodSecondRes = await fetch(
      `https://api.github.com/repos/${ORG}/${REPO}/issues?state=closed&labels=good second issue&per_page=100`,
      { headers }
    );
    const goodSecondIssues = await goodSecondRes.json();
    console.log(`✅ Found ${Array.isArray(goodSecondIssues) ? goodSecondIssues.length : 0} closed "good second issue" issues`);
    
    if (Array.isArray(goodSecondIssues) && goodSecondIssues.length > 0) {
      console.log('Sample good second issues:', goodSecondIssues.slice(0, 3).map(i => `#${i.number}: ${i.title.substring(0, 50)}...`));
    }

    // SIMPLER APPROACH: Use closed_by field (who closed the issue)
    // This is much faster and doesn't require fetching events/PRs
    const getIssueCloser = (issue: any) => {
      // GitHub provides closed_by field for closed issues
      if (issue.closed_by && issue.closed_by.login) {
        return issue.closed_by;
      }
      return null;
    };

    // Count contributions per user
    const userStats = new Map();

    // Process good first issues (5 points each)
    console.log('\n🔄 Processing good first issues...');
    let goodFirstCount = 0;
    let goodFirstSkipped = 0;
    
    for (const issue of Array.isArray(goodFirstIssues) ? goodFirstIssues : []) {
      if (issue.pull_request) {
        console.log(`⏭️  Skipping PR #${issue.number}`);
        continue;
      }

      const closer = getIssueCloser(issue);
      if (closer && closer.login) {
        if (!userStats.has(closer.login)) {
          userStats.set(closer.login, {
            login: closer.login,
            avatar: closer.avatar_url,
            goodFirst: 0,
            secondLevel: 0
          });
        }
        userStats.get(closer.login).goodFirst++;
        goodFirstCount++;
        console.log(`✅ Issue #${issue.number} "${issue.title.substring(0, 60)}..." closed by @${closer.login} (+5 pts)`);
      } else {
        goodFirstSkipped++;
        console.log(`⚠️  Issue #${issue.number} "${issue.title.substring(0, 60)}..." has no closed_by (skipped)`);
      }
    }
    
    console.log(`\n📊 Good first issues: ${goodFirstCount} counted, ${goodFirstSkipped} skipped`);

    // Process good second issues (10 points each)
    console.log('\n🔄 Processing good second issues...');
    let goodSecondCount = 0;
    let goodSecondSkipped = 0;
    
    for (const issue of Array.isArray(goodSecondIssues) ? goodSecondIssues : []) {
      if (issue.pull_request) {
        console.log(`⏭️  Skipping PR #${issue.number}`);
        continue;
      }

      const closer = getIssueCloser(issue);
      if (closer && closer.login) {
        if (!userStats.has(closer.login)) {
          userStats.set(closer.login, {
            login: closer.login,
            avatar: closer.avatar_url,
            goodFirst: 0,
            secondLevel: 0
          });
        }
        userStats.get(closer.login).secondLevel++;
        goodSecondCount++;
        console.log(`🚀 Issue #${issue.number} "${issue.title.substring(0, 60)}..." closed by @${closer.login} (+10 pts)`);
      } else {
        goodSecondSkipped++;
        console.log(`⚠️  Issue #${issue.number} "${issue.title.substring(0, 60)}..." has no closed_by (skipped)`);
      }
    }
    
    console.log(`\n📊 Good second issues: ${goodSecondCount} counted, ${goodSecondSkipped} skipped`);

    // TEST MODE: Add test user for Akshay-datazip (case-sensitive!)
    if (!userStats.has('Akshay-datazip')) {
      userStats.set('Akshay-datazip', {
        login: 'Akshay-datazip',
        avatar: 'https://avatars.githubusercontent.com/u/Akshay-datazip',
        goodFirst: 1,
        secondLevel: 0
      });
      // Note: Can't make exactly 7 pts with current system (5 or 10 pt increments)
      // Using 1 good first = 5 pts for now
      console.log('🧪 TEST MODE: Added Akshay-datazip with 1 good first issue (5 pts)');
    }

    // Create leaderboard and filter out bots
    const leaders = Array.from(userStats.values())
      .map(user => ({
        github_login: user.login,
        github_avatar_url: user.avatar,
        goodFirstPRs: user.goodFirst,
        secondLevelPRs: user.secondLevel,
        // Special case for Akshay-datazip testing: 7 pts instead of calculated
        total_points: user.login === 'Akshay-datazip' ? 7 : (user.goodFirst * 5) + (user.secondLevel * 10),
        breakdown: {
          goodFirstPRs: user.goodFirst,
          secondLevelPRs: user.secondLevel
        }
      }))
      .filter(user => {
        // Filter out bots
        const isBot = user.github_login.toLowerCase().includes('[bot]') || 
                      user.github_login.toLowerCase().includes('bot]') ||
                      user.github_login === 'github-actions[bot]' ||
                      user.github_login === 'dependabot[bot]' ||
                      user.github_login === 'renovate[bot]';
        
        if (isBot) {
          console.log(`🤖 Filtering out bot: @${user.github_login}`);
          return false;
        }
        
        return user.total_points > 0;
      })
      .sort((a, b) => b.total_points - a.total_points);

    console.log(`\n🏆 === FINAL LEADERBOARD ===`);
    console.log(`Total contributors with points: ${leaders.length}`);
    console.log(`Total points awarded: ${leaders.reduce((sum, u) => sum + u.total_points, 0)}`);
    console.log('\n👥 Top 5 contributors:');
    leaders.slice(0, 5).forEach((user, i) => {
      console.log(`  ${i + 1}. @${user.github_login}: ${user.total_points} pts (${user.goodFirstPRs} good first + ${user.secondLevelPRs} second level)`);
    });
    console.log(`\n✅ Leaderboard complete!`);

    return new Response(JSON.stringify(leaders), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
