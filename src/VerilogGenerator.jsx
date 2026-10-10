import { ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";
import "./VerilogGenerator.css";

function VerilogGenerator({
  variables,
  expression,
  onBack
}) {
  const [copied, setCopied] = useState(false);

  const variableNames = Array.from(
    { length: variables },
    (_, i) => String.fromCharCode(65 + i)
  );

  const convertExpressionToVerilog = () => {
    if (expression === "0") {
      return "1'b0";
    }

    if (expression === "1") {
      return "1'b1";
    }

    const terms = expression.split("+").map(
      (term) => term.trim()
    );

    const convertedTerms = terms.map((term) => {
      const literals = [];
      const regex = /([A-D])(')?/g;

      let match;

      while ((match = regex.exec(term)) !== null) {
        const variable = match[1];
        const inverted = Boolean(match[2]);

        literals.push(
          inverted
            ? `~${variable}`
            : variable
        );
      }

      if (literals.length === 1) {
        return literals[0];
      }

      return `(${literals.join(" & ")})`;
    });

    return convertedTerms.join(" | ");
  };

  const verilogExpression =
    convertExpressionToVerilog();

  const verilogCode = `module logicmin_circuit(
    ${variableNames
      .map((v) => `input wire ${v}`)
      .join(",\n    ")},
    output wire F
);

assign F = ${verilogExpression};

endmodule`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(verilogCode);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="verilog-page">

      <div className="verilog-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <span className="step-label">
            STEP 06
          </span>

          <h1>
            Verilog Generator
          </h1>

          <p>
            Automatically generated from your
            minimized Boolean expression.
          </p>
        </div>

      </div>


      <div className="verilog-expression-card">

        <span>
          SOURCE EXPRESSION
        </span>

        <strong>
          F = {expression}
        </strong>

      </div>


      <div className="verilog-code-card">

        <div className="code-toolbar">

          <span>
            logicmin_circuit.v
          </span>

          <button
            className="copy-button"
            onClick={copyCode}
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>

        </div>


        <pre>
          <code>
            {verilogCode}
          </code>
        </pre>

      </div>


      <div className="verilog-explanation">

        <h3>
          Conversion used
        </h3>

        <p>
          Boolean NOT becomes <code>~</code>,
          AND becomes <code>&</code>,
          and OR becomes <code>|</code>.
        </p>

      </div>

    </div>
  );
}

export default VerilogGenerator;