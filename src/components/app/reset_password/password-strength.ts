export const StrengthLevels = {
    WEAK: "weak",
    AVERAGE: "average",
    STRONG: "strong"
  };
  
  const lowerCaseRegex = /[a-z]/g;
  const upperCaseRegex = /[A-Z]/g;
  const numbersRegex = /[0-9]/g;
  const specialCharacterRegex = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
  
  const minLength = 8;
  let analysis:Record<string,number>  = {};
  
  const countChars = (str:string) => {
    const result:Record<string,number> = {};
    Array.from(str).forEach((char) => {
      const curVal = result[char];
      if (curVal) {
        result[char] += 1;
      } else {
        result[char] = 1;
      }
    });
    return result;
  };
  const analyzePassword = (password:string) => {
    const charMap = countChars(password);
    analysis = {
      length: password.length,
      uppercaseCount: 0,
      lowercaseCount: 0,
      numberCount: 0,
      symbolCount: 0
    };
  
    Object.keys(charMap).forEach((char) => {
      if (upperCaseRegex.test(char)) {
        analysis.uppercaseCount += charMap[char];
      } else if (lowerCaseRegex.test(char)) {
        analysis.lowercaseCount += charMap[char];
      } else if (numbersRegex.test(char)) {
        analysis.numberCount += charMap[char];
      } else if (specialCharacterRegex.test(char)) {
        analysis.symbolCount += charMap[char];
      }
    });
    return analysis;
  };
  
  export const isStrongPassword = (str:string) => {
    analysis = analyzePassword(str);
  
    return (
      analysis.length >= minLength &&
      analysis.lowercaseCount >= 1 &&
      analysis.uppercaseCount >= 1 &&
      analysis.numberCount >= 1 &&
      analysis.symbolCount >= 1
    );
  };
  export const superToggle = (element:any, class0:any, class1:any) => {
    /* eslint-disable no-unused-expressions */
    element?.classList.add(class0);
    element?.classList.remove(class1);
  };
  export function ValidatePassword(password:string) {
    /*Array of rules and the information target*/
    var rules = [
      {
        Pattern: "[A-Z]",
        Target: "UpperCase"
      },
      {
        Pattern: "[a-z]",
        Target: "LowerCase"
      },
      {
        Pattern: "[0-9]",
        Target: "Numbers"
      },
      {
        Pattern: `[!@@#$%^&*+:;'{}.,~=\"\(\)\\\\/\_\`\-]`,
        Target: "Symbols"
      }
    ];
  
    const length = document.getElementById("Length");
    const passwordContainer = document.getElementById("passwordStrength");
    password?.length > 6
      ? superToggle(length, "glyphicon-ok", "glyphicon-remove")
      : superToggle(length, "glyphicon-remove", "glyphicon-ok");
  
    /*Iterate our remaining rules. The logic is the same as for Length*/
    for (var i = 0; i < rules.length; i++) {
      const target = passwordContainer?.querySelector("#" + rules[i]?.Target);
      new RegExp(rules[i]?.Pattern).test(password)
        ? superToggle(target, "glyphicon-ok", "glyphicon-remove")
        : superToggle(target, "glyphicon-remove", "glyphicon-ok");
    }
  }
  