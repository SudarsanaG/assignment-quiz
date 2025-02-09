export async function GET() {
    const response = await fetch("https://api.jsonserve.com/Uw5CrX");
    
    console.log(response);
    const data = await response.json();
    
    console.log(data);
    return new Response(JSON.stringify({ questions: data.questions }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  