import readline from "readline";

//Math formula: complexity O(1)
function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2;
}

//Loop: complexity O(n)
function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    sum += i;
  }
  return sum;
}

//Recursion: complexity O(n)
function sum_to_n_c(n: number): number {
  if (n === 0) return 0;
  else return n + sum_to_n_c(n - 1);
}

// Helper function to measure execution time
function measureTime<T>(
  fn: () => T,
  label: string
): { result: T; time: number } {
  const start = process.hrtime.bigint();
  const result = fn();
  const end = process.hrtime.bigint();
  const timeInMs = Number(end - start) / 1_000_000; // Convert nanoseconds to milliseconds
  return { result, time: timeInMs };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter a number to calculate sum from 1 to n: ", (answer) => {
  const n = parseInt(answer, 10);

  if (isNaN(n) || n < 0) {
    console.log("Invalid input! Please enter a non-negative number.");
    rl.close();
    return;
  }

  // Measure and execute formula method
  const { result: number1, time: time1 } = measureTime(
    () => sum_to_n_a(n),
    "Formula"
  );
  console.log(
    `Result using formula - O(1): ${number1} (Time: ${time1.toFixed(6)} ms)`
  );

  // Measure and execute loop method
  const { result: number2, time: time2 } = measureTime(
    () => sum_to_n_b(n),
    "Loop"
  );
  console.log(
    `Result using loop - O(n): ${number2} (Time: ${time2.toFixed(6)} ms)`
  );

  // Measure and execute recursion method
  let number3: number | null = null;
  //check overflow stack
  if (n > 10000) {
    console.log(
      `Result using recursion - O(n): Skipped (n=${n} is too large, will cause stack overflow)`
    );
  } else {
    const result = measureTime(() => sum_to_n_c(n), "Recursion");
    number3 = result.result;
    console.log(
      `Result using recursion - O(n): ${number3} (Time: ${result.time.toFixed(
        6
      )} ms)`
    );
  }

  rl.close();
});
