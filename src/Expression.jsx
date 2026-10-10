import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import "./Expression.css";

function Expression({ groups, truthValues, onBack, onNext }) {

  const hasOnes = truthValues.some((value) => value === "1");
  const allOnes = truthValues.every((value) => value === "1");

  let expression = "";

  if (!hasOnes) {
    expression = "0";
  } else if (allOnes) {
    expression = "1";
  } else {
    expression = groups.map((group) => group.term).join(" + ");
  }

  return (
    <div className="expression-page">

      {/* HEADER */}
      <div className="expression-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <span className="step-label">
            STEP 04
          </span>

          <h1>
            Simplified Expression
          </h1>

          <p>
            Each K-map group generates one Boolean product term.
          </p>
        </div>

      </div>


      {/* MAIN RESULT */}

      <div className="expression-result-card">

        <div className="result-label">
          MINIMIZED SOP
        </div>

        <div className="expression-box">
          <span className="f-label">
            F =
          </span>

          <span className="expression-value">
            {expression}
          </span>
        </div>

        <div className="expression-note">
          Simplified using the K-map groups generated in the previous step.
        </div>

      </div>


      {/* GROUP BREAKDOWN */}

      <div className="expression-groups">

        <div className="expression-section-title">

          <Sparkles size={20} />

          <h2>
            From K-Map Groups
          </h2>

        </div>


        {!hasOnes ? (

          <div className="special-expression">
            No minterms are present, therefore the function is always 0.
          </div>

        ) : allOnes ? (

          <div className="special-expression">
            Every truth-table output is 1, therefore the function is always 1.
          </div>

        ) : (

          <div className="expression-group-list">

            {groups.map((group, index) => (

              <div
                className="expression-group-card"
                key={group.id}
              >

                <div
                  className={`expression-group-number group-color-${index % 6}`}
                >
                  {group.id}
                </div>

                <div className="expression-group-details">

                  <span>
                    Minterms
                  </span>

                  <strong>
                    {group.minterms
                      .map((m) => `m${m}`)
                      .join(", ")}
                  </strong>

                </div>

                <div className="expression-arrow">
                  →
                </div>

                <div className="expression-term">
                  {group.term}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* EXPLANATION */}

      {!allOnes && hasOnes && (

        <div className="expression-explanation">

          <h3>
            How was this simplified?
          </h3>

          <p>
            Inside each K-map group, variables that change between
            0 and 1 are eliminated. Only variables that remain constant
            become part of the Boolean term.
          </p>

        </div>

      )}


      {/* ACTIONS */}

      <div className="expression-actions">

        <button
          className="secondary-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to K-Map
        </button>

        <button
          className="generate-button"
          onClick={() => onNext(expression)}
        >
          Construct Circuit
          <ArrowRight size={18} />
        </button>

      </div>

    </div>
  );
}

export default Expression;