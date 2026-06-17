import { NextResponse } from "next/server";
import { runProductGuideEvals } from "@/lib/evals/product-guide-evals";

export async function GET() {
  try {
    const results = runProductGuideEvals();
    return NextResponse.json({
      passed: results.filter((result) => result.passed).length,
      total: results.length,
      results
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to run product guide evals" },
      { status: 500 }
    );
  }
}
