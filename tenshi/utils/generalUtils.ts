import { Request } from "express";
/*
    General Utils is a class that works for every environments
    Its methos can we use in some rest project
*/
export function getUrlParam(key : string, req: Request): string {
    let param : string = "";
    if(req.query[key] != undefined){
        param = req.query[key] as string;
    }

    return param;
}

export function toSnakeCase(str: string): string {
    return str
        .replace(/([A-Z])/g, "_$1")  // Insert an underscore before each uppercase letter
        .toLowerCase()                // Convert the entire string to lowercase
        .replace(/^_/, "");           // Remove the leading underscore if it exists
}


export function camelToUpperSnakeCase(text: string): string {
    return text
      // Insert an underscore before each uppercase letter, except the first one
      .replace(/([A-Z])/g, '_$1')
      // Convert the entire string to uppercase
      .toUpperCase()
      // Remove the leading underscore if it exists
      .replace(/^_/, '');
  }
  


/**
 * Retrieves the name of the current function from the call stack.
 * 
 * @returns The name of the current function, or undefined if it cannot be determined.
 */
export function getCurrentFunctionName(): string | undefined {

    // Create a new Error object to extract the call stack
    const error = new Error();
    const stack = error.stack;
    if (!stack) return undefined;

    // Split the call stack into lines to analyze each line
    const stackLines = stack.split('\n');
    
    // Get the line of the caller function
    const callerLine = stackLines[2];
    if (!callerLine) return undefined;

    // Extract the function name from the caller line
    const functionNameMatch = callerLine.trim().match(/at (.*?) /);
    return functionNameMatch ? functionNameMatch[1] : undefined;
}
