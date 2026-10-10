import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import "./TruthTable.css";

function TruthTable({ variables, onBack, onGenerate }) {
  const totalRows = Math.pow(2, variables);

  const [values, setValues] = useState(
    Array(totalRows).fill("")
  );

  const generateInputs = () => {
    const rows = [];

    for (let i = 0; i < totalRows; i++) {
      const row = [];

      for (let j = variables - 1; j >= 0; j--) {
        row.push((i >> j) & 1);
      }

      rows.push(row);
    }

    return rows;
  };

  const inputRows = generateInputs();

  const handleChange = (index, value) => {
    const updated = [...values];
    updated[index] = value;
    setValues(updated);
  };

  const allFilled = values.every((value) => value !== "");

  const handleGenerate = () => {
    if (!allFilled) return;

    onGenerate(values);
  };

  return (
    <div className="truth-page">

      <div className="truth-header">

        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <span className="step-label">STEP 02</span>
          <h1>Truth Table</h1>
          <p>
            Enter the output value <strong>F</strong> for each
            combination.
          </p>
        </div>

      </div>


      <div className="truth-info">

        <div>
          <span>VARIABLES</span>
          <strong>
            {Array.from(
              { length: variables },
              (_, i) => String.fromCharCode(65 + i)
            ).join("  ")}
          </strong>
        </div>

        <div>
          <span>COMBINATIONS</span>
          <strong>{totalRows}</strong>
        </div>

        <div>
          <span>INPUT</span>
          <strong>F ONLY</strong>
        </div>

      </div>


      <div className="truth-card">

        <table>

          <thead>

            <tr>

              {Array.from(
                { length: variables },
                (_, i) => (
                  <th key={i}>
                    {String.fromCharCode(65 + i)}
                  </th>
                )
              )}

              <th className="output-heading">F</th>

            </tr>

          </thead>

          <tbody>

            {inputRows.map((row, index) => (

              <tr key={index}>

                {row.map((value, i) => (
                  <td key={i}>{value}</td>
                ))}

                <td>

                  <select
                    value={values[index]}
                    onChange={(e) =>
                      handleChange(index, e.target.value)
                    }
                    className={
                      values[index] !== ""
                        ? "filled"
                        : ""
                    }
                  >

                    <option value="">—</option>
                    <option value="0">0</option>
                    <option value="1">1</option>

                  </select>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      <div className="truth-actions">

        <button
          className="secondary-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Change Variables
        </button>


        <button
          className={
            allFilled
              ? "generate-button"
              : "generate-button disabled"
          }
          onClick={handleGenerate}
          disabled={!allFilled}
        >

          {allFilled && <Check size={18} />}

          Generate K-Map

          <ArrowRight size={18} />

        </button>

      </div>

    </div>
  );
}

export default TruthTable;