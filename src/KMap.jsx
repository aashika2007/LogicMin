import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import "./KMap.css";

function KMap({
  variables,
  truthValues,
  onBack,
  onBuildExpression
}) {

  const gray2 = [0, 1, 3, 2];

  // -----------------------------------------
  // CREATE K-MAP
  // -----------------------------------------


  const getKMapData = () => {

    if (variables === 2) {
      return {
        rowLabels: ["0", "1"],
        colLabels: ["0", "1"],

        cells: [
          [truthValues[0], truthValues[1]],
          [truthValues[2], truthValues[3]],
        ],

        minterms: [
          [0, 1],
          [2, 3],
        ],
      };
    }


    if (variables === 3) {
      return {
        rowLabels: ["0", "1"],
        colLabels: ["00", "01", "11", "10"],

        cells: [
          gray2.map((col) => truthValues[col]),
          gray2.map((col) => truthValues[4 + col]),
        ],

        minterms: [
          gray2.map((col) => col),
          gray2.map((col) => 4 + col),
        ],
      };
    }


    return {
      rowLabels: ["00", "01", "11", "10"],
      colLabels: ["00", "01", "11", "10"],

      cells: gray2.map((row) =>
        gray2.map((col) => {
          const index = row * 4 + col;
          return truthValues[index];
        })
      ),

      minterms: gray2.map((row) =>
        gray2.map((col) => row * 4 + col)
      ),
    };
  };


  const map = getKMapData();

  const rows = map.cells.length;
  const cols = map.cells[0].length;


  // -----------------------------------------
  // GENERATE BOOLEAN TERM FOR A GROUP
  // -----------------------------------------

  const createTerm = (minterms) => {

    const variableNames = ["A", "B", "C", "D"];

    let term = "";

    for (let bit = 0; bit < variables; bit++) {

      const shift = variables - bit - 1;

      const values = minterms.map(
        (m) => (m >> shift) & 1
      );

      const allSame = values.every(
        (value) => value === values[0]
      );

      if (allSame) {

        if (values[0] === 1) {
          term += variableNames[bit];
        } else {
          term += variableNames[bit] + "'";
        }

      }
    }

    return term || "1";
  };


  // -----------------------------------------
  // FIND ALL VALID GROUPS
  // -----------------------------------------

  const groups = useMemo(() => {

    const possibleGroups = [];

    const rowSizes =
      rows === 2 ? [1, 2] : [1, 2, 4];

    const colSizes =
      cols === 2 ? [1, 2] : [1, 2, 4];


    for (const height of rowSizes) {

      if (height > rows) continue;


      for (const width of colSizes) {

        if (width > cols) continue;


        for (let startRow = 0; startRow < rows; startRow++) {

          for (let startCol = 0; startCol < cols; startCol++) {

            const cellPositions = [];
            const minterms = [];

            let valid = true;


            for (let r = 0; r < height; r++) {

              for (let c = 0; c < width; c++) {

                // modulo gives us K-map wrap-around
                const actualRow =
                  (startRow + r) % rows;

                const actualCol =
                  (startCol + c) % cols;


                if (
                  map.cells[actualRow][actualCol] !== "1"
                ) {
                  valid = false;
                }


                cellPositions.push(
                  `${actualRow}-${actualCol}`
                );

                minterms.push(
                  map.minterms[actualRow][actualCol]
                );
              }
            }


            if (valid) {

              const uniqueCells =
                [...new Set(cellPositions)].sort();

              const uniqueMinterms =
                [...new Set(minterms)].sort(
                  (a, b) => a - b
                );


              // Ignore accidental duplicate wrapped cells
              if (
                uniqueCells.length !==
                height * width
              ) {
                continue;
              }


              possibleGroups.push({
                cells: uniqueCells,
                minterms: uniqueMinterms,
                size: uniqueCells.length,
              });
            }
          }
        }
      }
    }


    // -----------------------------------------
    // REMOVE DUPLICATES
    // -----------------------------------------

    const unique = [];

    const seen = new Set();


    for (const group of possibleGroups) {

      const key = group.cells.join("|");

      if (!seen.has(key)) {

        seen.add(key);

        unique.push(group);
      }
    }


    // -----------------------------------------
    // KEEP ONLY PRIME GROUPS
    // -----------------------------------------
    // If one group is completely contained
    // inside a larger group, remove it.

    const primeGroups = unique.filter(
      (group, index) => {

        return !unique.some(
          (other, otherIndex) => {

            if (index === otherIndex) return false;

            if (other.size <= group.size)
              return false;

            return group.cells.every(
              (cell) =>
                other.cells.includes(cell)
            );
          }
        );
      }
    );


    // -----------------------------------------
    // ALL CELLS THAT MUST BE COVERED
    // -----------------------------------------

    const requiredCells = [];

    for (let r = 0; r < rows; r++) {

      for (let c = 0; c < cols; c++) {

        if (map.cells[r][c] === "1") {

          requiredCells.push(`${r}-${c}`);
        }
      }
    }


    if (requiredCells.length === 0) {
      return [];
    }


    // -----------------------------------------
    // FIND BEST COMBINATION OF PRIME GROUPS
    // -----------------------------------------

    let bestSelection = null;


    const totalCombinations =
      1 << primeGroups.length;


    for (
      let mask = 1;
      mask < totalCombinations;
      mask++
    ) {

      const selected = [];

      const covered = new Set();


      for (
        let i = 0;
        i < primeGroups.length;
        i++
      ) {

        if (mask & (1 << i)) {

          selected.push(primeGroups[i]);

          primeGroups[i].cells.forEach(
            (cell) => covered.add(cell)
          );
        }
      }


      const coversEverything =
        requiredCells.every(
          (cell) => covered.has(cell)
        );


      if (!coversEverything) continue;


      // Prefer fewer groups
      if (
        !bestSelection ||
        selected.length < bestSelection.length
      ) {

        bestSelection = selected;

        continue;
      }


      // If same number of groups,
      // prefer larger groups overall
      if (
        selected.length ===
        bestSelection.length
      ) {

        const selectedSize =
          selected.reduce(
            (sum, group) =>
              sum + group.size,
            0
          );

        const bestSize =
          bestSelection.reduce(
            (sum, group) =>
              sum + group.size,
            0
          );


        if (selectedSize > bestSize) {
          bestSelection = selected;
        }
      }
    }


    return (bestSelection || []).map(
      (group, index) => ({
        ...group,

        id: `G${index + 1}`,

        term: createTerm(
          group.minterms
        ),
      })
    );

  }, [truthValues, variables]);


  // -----------------------------------------
  // FIND WHICH GROUPS CONTAIN A CELL
  // -----------------------------------------

  const getCellGroups = (row, col) => {

    const cell = `${row}-${col}`;

    return groups.filter(
      (group) =>
        group.cells.includes(cell)
    );
  };


  const getRowVariable = () => {

    if (variables === 4)
      return "AB";

    return "A";
  };


  const getColumnVariable = () => {

    if (variables === 2)
      return "B";

    if (variables === 3)
      return "BC";

    return "CD";
  };


  return (

    <div className="kmap-page">


      {/* HEADER */}

      <div className="kmap-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />

          Back
        </button>


        <div>

          <span className="step-label">
            STEP 03
          </span>

          <h1>
            Karnaugh Map
          </h1>

          <p>
            LogicMin automatically finds the
            largest valid groups of adjacent 1s.
          </p>

        </div>

      </div>


      {/* INFO */}

      <div className="kmap-info">

        <div>
          <span>VARIABLES</span>
          <strong>{variables}</strong>
        </div>

        <div>
          <span>MINTERMS</span>

          <strong>
            {
              truthValues.filter(
                (value) => value === "1"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>GROUPS FOUND</span>

          <strong>
            {groups.length}
          </strong>
        </div>

      </div>


      {/* K-MAP */}

      <div
        className="kmap-card"
        style={{
          "--kmap-columns": cols,
        }}
      >

        <div className="kmap-corner">

          <span>
            {getRowVariable()}
          </span>

          <span className="slash">
            /
          </span>

          <span>
            {getColumnVariable()}
          </span>

        </div>


        <div
          className="kmap-column-labels"
          style={{
            gridTemplateColumns:
              `repeat(${cols}, 1fr)`,
          }}
        >

          {map.colLabels.map(
            (label) => (

              <div key={label}>
                {label}
              </div>

            )
          )}

        </div>


        <div className="kmap-body">

          <div className="kmap-row-labels">

            {map.rowLabels.map(
              (label, index) => (

                <div key={index}>
                  {label}
                </div>

              )
            )}

          </div>


          <div
            className="kmap-grid"
            style={{
              gridTemplateColumns:
                `repeat(${cols}, 1fr)`,

              gridTemplateRows:
                `repeat(${rows}, 90px)`,
            }}
          >

            {map.cells.map(
              (row, rowIndex) =>

                row.map(
                  (value, colIndex) => {

                    const cellGroups =
                      getCellGroups(
                        rowIndex,
                        colIndex
                      );


                    return (

                      <div
                        key={
                          `${rowIndex}-${colIndex}`
                        }
                        className={
                          value === "1"
                            ? "kmap-cell one"
                            : "kmap-cell zero"
                        }
                      >

                        <span className="cell-value">
                          {value}
                        </span>


                        <span className="minterm-number">
                          m
                          {
                            map.minterms
                              [rowIndex]
                              [colIndex]
                          }
                        </span>


                        {cellGroups.length > 0 && (

                          <div className="cell-group-tags">

                            {cellGroups.map(
                              (group, groupIndex) => (

                                <span
                                  key={group.id}
                                  className={
                                    `group-tag group-color-${groupIndex % 6}`
                                  }
                                >
                                  {group.id}
                                </span>

                              )
                            )}

                          </div>

                        )}

                      </div>

                    );
                  }
                )
            )}

          </div>

        </div>

      </div>


      {/* GROUP RESULTS */}

      <div className="groups-section">

        <div className="groups-heading">

          <Sparkles size={21} />

          <h2>
            Groups Found
          </h2>

        </div>


        {groups.length === 0 ? (

          <div className="no-groups">

            No groups are required because
            the function contains no 1s.

          </div>

        ) : (

          <div className="group-list">

            {groups.map(
              (group, index) => (

                <div
                  className="group-result"
                  key={group.id}
                >

                  <div
                    className={
                      `group-dot group-color-${index % 6}`
                    }
                  />


                  <div>

                    <strong>
                      {group.id}
                    </strong>

                    <p>
                      Minterms:{" "}
                      {group.minterms
                        .map((m) => `m${m}`)
                        .join(", ")}
                    </p>

                  </div>


                  <div className="group-size">

                    {group.size}
                    -cell group

                  </div>


                  <div className="group-term">

                    {group.term}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* BOTTOM BUTTONS */}

      <div className="kmap-actions">

        <button
          className="secondary-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />

          Edit Truth Table
        </button>


        <button
          className="generate-button"
           onClick={() => onBuildExpression(groups)}
         >
        Build Expression
        <ArrowRight size={18} />
       </button>

      </div>

    </div>
  );
}


export default KMap;