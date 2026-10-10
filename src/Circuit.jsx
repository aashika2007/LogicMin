import { useMemo, useState } from "react";
import { ArrowLeft, Code2, Cpu } from "lucide-react";
import "./Circuit.css";

function Circuit({
  variables,
  groups,
  expression,
  onBack,
  onVerilog
}) {
  const variableColors = {
    A: "#2374e1",
    B: "#20a35a",
    C: "#e98221",
    D: "#805ad5",
  };
  const [inputValues, setInputValues] = useState(() => ({
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  }));
   
  const toggleInput = (variable) => {
  setInputValues((current) => ({
    ...current,
    [variable]: current[variable] === 0 ? 1 : 0,
  }));
 };

  const parseTerm = (term) => {
    const literals = [];
    const regex = /([A-D])(')?/g;

    let match;

    while ((match = regex.exec(term)) !== null) {
      literals.push({
        variable: match[1],
        inverted: Boolean(match[2]),
      });
    }

    return literals;
  };

  const terms = groups.map((group) => ({
    ...group,
    literals: parseTerm(group.term),
  }));
  const simulatedTerms = useMemo(() => {
  return terms.map((term) => {
    const literalValues = term.literals.map((literal) => {
      const originalValue = inputValues[literal.variable];

      return literal.inverted
        ? originalValue === 0
          ? 1
          : 0
        : originalValue;
    });

    const value =
      literalValues.length === 0
        ? 0
        : literalValues.every((v) => v === 1)
        ? 1
        : 0;

    return {
      ...term,
      value,
    };
  });
 }, [terms, inputValues]);

 const outputValue =
  expression === "0"
    ? 0
    : expression === "1"
    ? 1
    : simulatedTerms.some((term) => term.value === 1)
    ? 1
    : 0;

  const variableNames = Array.from(
    { length: variables },
    (_, i) => String.fromCharCode(65 + i)
  );

  const width = 1000;
  const termSpacing = 150;

  const height = Math.max(
    500,
    terms.length * termSpacing + 220
  );

  const inputX = 80;
  const notX = 230;
  const andX = 520;
  const orX = 790;
  const outputX = 930;

  const getInputY = (variable) => {
    const index = variableNames.indexOf(variable);

    if (variableNames.length === 1) {
      return height / 2;
    }

    return (
      110 +
      index *
        ((height - 220) /
          Math.max(variableNames.length - 1, 1))
    );
  };

  // CONSTANT FUNCTIONS
  if (expression === "0" || expression === "1") {
    return (
      <div className="circuit-page">
        <div className="circuit-header">
          <button
            className="back-button"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div>
            <span className="step-label">
              STEP 05
            </span>

            <h1>Circuit Diagram</h1>

            <p>
              Generated automatically from the
              minimized Boolean expression.
            </p>
          </div>
        </div>

        <div className="circuit-expression">
          <span>MINIMIZED FUNCTION</span>
          <strong>F = {expression}</strong>
        </div>

        <div className="circuit-canvas constant-circuit">
          <div className="constant-source">
            <span>CONSTANT</span>
            <strong>{expression}</strong>
          </div>

          <div className="constant-wire">
            ─────────→
          </div>

          <div className="output-node">
            F
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="circuit-page">

      {/* HEADER */}
      <div className="circuit-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <span className="step-label">
            STEP 05
          </span>

          <h1>Circuit Diagram</h1>

          <p>
            LogicMin converted your simplified
            expression into a logic circuit.
          </p>
        </div>
      </div>
      {/* SIMULATOR */}

<div className="simulation-panel">

  <div className="simulation-header">

    <div>
      <span className="simulation-label">
        LIVE SIMULATION
      </span>

      <h2>
        Test Your Circuit
      </h2>
    </div>

    <div
      className={
        outputValue === 1
          ? "live-output active"
          : "live-output"
      }
    >
      F = {outputValue}
    </div>

  </div>


  <div className="simulation-inputs">

    {variableNames.map((variable) => (

      <button
        key={variable}
        className={
          inputValues[variable] === 1
            ? "input-toggle active"
            : "input-toggle"
        }
        style={{
          "--variable-color":
            variableColors[variable],
        }}
        onClick={() => toggleInput(variable)}
      >

        <span className="toggle-variable">
          {variable}
        </span>

        <span className="toggle-value">
          {inputValues[variable]}
        </span>

      </button>

    ))}

  </div>

   </div>


      {/* EXPRESSION */}
      <div className="circuit-expression">
        <span>IMPLEMENTING</span>

        <strong>
          F = {expression}
        </strong>
      </div>


      {/* CIRCUIT */}
      <div className="circuit-canvas">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="logic-svg"
        >

          {/* GRID */}
          <defs>
            <pattern
              id="smallGrid"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 25 0 L 0 0 0 25"
                className="grid-line"
                fill="none"
              />
            </pattern>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="url(#smallGrid)"
          />


          {/* INPUT TITLE */}
          <text
            x="45"
            y="40"
            className="svg-section-label"
          >
            INPUTS
          </text>


          {/* INPUT NODES */}
          {variableNames.map((variable) => {
            const y = getInputY(variable);

            return (
              <g key={variable}>

                <circle
                  cx={inputX}
                  cy={y}
                  r="20"
                  className={
                     inputValues[variable] === 1
                     ? "input-circle signal-active"
                      : "input-circle"
                    }
                 style={{
                     stroke: variableColors[variable],
                     fill:
                     inputValues[variable] === 1
                       ? variableColors[variable]
                       : undefined,
                     }}
                 />

                <text
                  x={inputX}
                  y={y + 7}
                  textAnchor="middle"
                  className="input-text"
                  style={{
                    fill:
                      inputValues[variable] === 1
                        ? "white"
                        : variableColors[variable],
                  }}
                >
                  {variable}
                </text>

              </g>
            );
          })}


          {/* PRODUCT TERMS */}
          {terms.map((term, termIndex) => {
            const termY =
              120 + termIndex * termSpacing;

            return (
              <g key={term.id}>

                {/* TERM LABEL */}
                <text
                  x={andX - 120}
                  y={termY - 55}
                  className="group-label-svg"
                >
                  {term.id}: {term.term}= {simulatedTerms[termIndex]?.value}
                </text>


                {/* INPUT WIRES */}
                {term.literals.map(
                  (literal, literalIndex) => {
                    const inputY =
                      getInputY(
                        literal.variable
                      );

                    const color =
                      variableColors[
                        literal.variable
                      ];

                    const targetY =
                      termY +
                      (
                        literalIndex -
                        (term.literals.length - 1) /
                          2
                      ) *
                        30;


                    // INVERTED VARIABLE
                    if (literal.inverted) {
                      return (
                        <g
                          key={`${term.id}-${literal.variable}-${literalIndex}`}
                        >

                          {/* INPUT → NOT */}
                          <path
                            d={`
                              M ${inputX + 20} ${inputY}
                              H ${notX - 35}
                            `}
                            className="variable-wire"
                            style={{
                              stroke: color,
                            }}
                            fill="none"
                          />


                          {/* NOT TRIANGLE */}
                          <polygon
                            points={`
                              ${notX - 35},${inputY - 18}
                              ${notX - 35},${inputY + 18}
                              ${notX - 3},${inputY}
                            `}
                            className="not-gate"
                            style={{
                              stroke: color,
                            }}
                          />


                          {/* NOT BUBBLE */}
                          <circle
                            cx={notX + 6}
                            cy={inputY}
                            r="7"
                            className="not-bubble"
                            style={{
                              stroke: color,
                            }}
                          />


                          {/* COMPLEMENT LABEL */}
                          <text
                            x={notX + 25}
                            y={inputY - 10}
                            className="literal-label"
                            style={{
                              fill: color,
                            }}
                          >
                            {literal.variable}'
                          </text>


                          {/* NOT → AND */}
                          <path
                            d={`
                              M ${notX + 13} ${inputY}
                              H ${andX - 90}
                              V ${targetY}
                              H ${andX}
                            `}
                            className="variable-wire complement-wire"
                            style={{
                              stroke: color,
                            }}
                            fill="none"
                          />

                        </g>
                      );
                    }


                    // NORMAL VARIABLE
                    return (
                      <path
                        key={`${term.id}-${literal.variable}-${literalIndex}`}
                        d={`
                          M ${inputX + 20} ${inputY}
                          H ${andX - 90}
                          V ${targetY}
                          H ${andX}
                        `}
                        className="variable-wire"
                        style={{
                          stroke: color,
                        }}
                        fill="none"
                      />
                    );
                  }
                )}


                {/* AND GATE */}
                {term.literals.length > 1 ? (
                  <g>

                    <path
                      d={`
                        M ${andX} ${termY - 42}
                        L ${andX + 38} ${termY - 42}

                        C ${andX + 100} ${termY - 42},
                          ${andX + 100} ${termY + 42},
                          ${andX + 38} ${termY + 42}

                        L ${andX} ${termY + 42}
                        Z
                      `}
                      className="and-gate"
                    />

                    <text
                      x={andX + 45}
                      y={termY + 6}
                      textAnchor="middle"
                      className="gate-text"
                    >
                      AND
                    </text>

                  </g>
                ) : (
                  <circle
                    cx={andX + 45}
                    cy={termY}
                    r="8"
                    className="junction"
                  />
                )}

              </g>
            );
          })}


          {/* CLEAN AND → OR ROUTING */}
          {terms.length > 1 &&
            terms.map((term, index) => {

              const termY =
                120 + index * termSpacing;

              const orInputY =
                height / 2 +
                (
                  index -
                  (terms.length - 1) / 2
                ) *
                  55;

              const andOutputX =
                term.literals.length > 1
                  ? andX + 95
                  : andX + 53;

              const bendX =
                orX - 110;

              return (
                <path
                  key={`route-${term.id}`}
                  d={`
                    M ${andOutputX} ${termY}
                    H ${bendX}
                    V ${orInputY}
                    H ${orX - 48}
                  `}
                  className="term-wire"
                  fill="none"
                />
              );
            })}


          {/* OR GATE */}
          {terms.length > 1 ? (
            <g>

              <path
                d={`
                  M ${orX - 48} ${height / 2 - 75}

                  Q ${orX - 10} ${height / 2}
                    ${orX - 48} ${height / 2 + 75}

                  Q ${orX + 45} ${height / 2 + 58}
                    ${orX + 95} ${height / 2}

                  Q ${orX + 45} ${height / 2 - 58}
                    ${orX - 48} ${height / 2 - 75}

                  Z
                `}
                className="or-gate"
              />

              <text
                x={orX + 20}
                y={height / 2 + 7}
                textAnchor="middle"
                className="gate-text"
              >
                OR
              </text>


              {/* OR → F */}
              <path
                d={`
                  M ${orX + 95} ${height / 2}
                  H ${outputX}
                `}
                className="output-wire"
                fill="none"
              />

            </g>
          ) : (

            /* SINGLE PRODUCT TERM → F */
            <path
              d={`
                M ${
                  terms[0].literals.length > 1
                    ? andX + 95
                    : andX + 53
                }
                120

                H ${outputX}
              `}
              className="output-wire"
              fill="none"
            />

          )}


          {/* OUTPUT NODE */}
          <circle
            cx={outputX}
            cy={
              terms.length > 1
                ? height / 2
                : 120
            }
            r="24"
            className={
                outputValue === 1
                ? "output-circle output-active"
                 : "output-circle"
            }
          />

          <text
            x={outputX}
            y={
              (terms.length > 1
                ? height / 2
                : 120) + 8
            }
            textAnchor="middle"
            className="output-text"
          >
            {`F=${outputValue}`}
          </text>

        </svg>

      </div>


      {/* LEGEND */}
      <div className="circuit-legend">

        <div className="variable-legend">
          {variableNames.map(
            (variable) => (
              <span
                key={variable}
                className="legend-variable"
                style={{
                  borderColor:
                    variableColors[variable],

                  color:
                    variableColors[variable],
                }}
              >
                {variable}
              </span>
            )
          )}

          <small>
            Variables
          </small>
        </div>


        <div>
          <span className="normal-line-example" />
          Normal
        </div>


        <div>
          <span className="dashed-line-example" />
          Complement
        </div>


        <div>
          <span className="legend-symbol and-symbol">
            ∩
          </span>
          AND
        </div>


        <div>
          <span className="legend-symbol or-symbol">
            ≥1
          </span>
          OR
        </div>


        <div>
          <span className="legend-symbol">
            ▷○
          </span>
          NOT
        </div>

      </div>


      {/* NEXT */}
      <div className="circuit-next">

        <div>

          <Cpu size={24} />

          <div>
            <strong>
              Circuit generated successfully
            </strong>

            <p>
              Next we'll add live simulation
              and Verilog generation.
            </p>
          </div>

        </div>


        <button
          className="generate-button"
           onClick={onVerilog}
       >
      <Code2 size={18} />
        Generate Verilog
      </button>

      </div>

    </div>
  );
}

export default Circuit;