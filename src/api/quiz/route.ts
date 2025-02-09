export async function GET() {
    const response = await fetch("https://api.jsonserve.com/Uw5CrX");
    const data = await response.json();
    console.log("hi");
    console.log(data);
    return new Response(JSON.stringify({ questions: data.results }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  