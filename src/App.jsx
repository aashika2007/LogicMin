import { useState } from "react";
import {
  Home,
  Table2,
  Grid2X2,
  FunctionSquare,
  CircuitBoard,
  Code2,
  Play,
  Settings,
  Moon,
  Sun,
  Lightbulb,
  Cpu,
  Plus,
} from "lucide-react";

import TruthTable from "./TruthTable";
import "./App.css";
import KMap from "./KMap";
import Expression from "./Expression";
import Circuit from "./Circuit";
import VerilogGenerator from "./VerilogGenerator";

function App() {
  const [groups, setGroups] = useState([]);
  const [expression, setExpression] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [variables, setVariables] = useState(null);
  const [page, setPage] = useState("home");
  const [truthValues, setTruthValues] = useState([]);

  return (
    <div className={darkMode ? "app dark" : "app"}>

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <CircuitBoard size={32} />
          <span>
            Logic<span className="logo-blue">Min</span>
          </span>
        </div>

        <nav>

          <div
            className="nav-item active"
            onClick={() => setPage("home")}
          >
            <Home size={20} />
            <span>Home</span>
          </div>

          <div className="nav-item">
            <Table2 size={20} />
            <span>Truth Table</span>
          </div>

          <div className="nav-item">
            <Grid2X2 size={20} />
            <span>K-Map</span>
          </div>

          <div className="nav-item">
            <FunctionSquare size={20} />
            <span>Expression</span>
          </div>

          <div className="nav-item">
            <CircuitBoard size={20} />
            <span>Circuit</span>
          </div>

          <div className="nav-item">
            <Code2 size={20} />
            <span>Verilog</span>
          </div>

          <div className="nav-item">
            <Play size={20} />
            <span>Simulator</span>
          </div>

        </nav>

        <div className="sidebar-bottom">

          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

        </div>

      </aside>


      {/* MAIN */}
      <main className="main">

        {page === "truth" ? (

          <TruthTable
            variables={variables}
            onBack={() => setPage("home")}
            onGenerate={(values) => {
             setTruthValues(values);
             setPage("kmap");
            }}
          />
          ) : page === "kmap" ? (

         <KMap
            variables={variables}
            truthValues={truthValues}
            onBack={() => setPage("truth")}
            onBuildExpression={(generatedGroups) => {
            setGroups(generatedGroups);
            setPage("expression");
           }}
          />

           ) : page === "expression" ? (

            <Expression
              groups={groups}
              truthValues={truthValues}
              onBack={() => setPage("kmap")}
              onNext={(generatedExpression) => {
                setExpression(generatedExpression);
                setPage("circuit");
              }}
            />

           ) : page === "circuit" ? (

           <Circuit
            variables={variables}
            groups={groups}
            expression={expression}
            onBack={() => setPage("expression")}
            onVerilog={() => setPage("verilog")}
           />
           ) : page === "verilog" ? (

           <VerilogGenerator
             variables={variables}
             expression={expression}
             onBack={() => setPage("circuit")}
            />

            ) : (

          

          <>
            {/* HEADER */}

            <header className="header">

              <div className="header-decoration">
                <Cpu size={35} />
              </div>

              <div className="title-area">

                <h1>
                  Digital Logic <span>Minimizer</span>
                </h1>

                <p>
                  Truth Table
                  <b> → </b>
                  K-Map
                  <b> → </b>
                  Minimized Expression
                  <b> → </b>
                  Circuit
                </p>

              </div>

              <button className="new-project">
                <Plus size={18} />
                New Project
              </button>

            </header>


            {/* HERO */}

            <section className="hero">

              <div className="hero-decoration">
                <Lightbulb size={50} />
              </div>

              <h2>
                Turn Truth Tables
                <br />
                into <span>Optimized Circuits.</span>
              </h2>

              <p>
                Enter your function values and let LogicMin handle the
                K-Map grouping, Boolean minimization and circuit construction.
              </p>

            </section>


            {/* VARIABLE SELECTOR */}

            <section className="variable-section">

              <div className="section-heading">

                <div className="step-number">
                  01
                </div>

                <div>
                  <h2>Choose Your Variables</h2>

                  <p>
                    Select the number of input variables for your logic function.
                  </p>
                </div>

              </div>


              <div className="variable-cards">

                {[2, 3, 4].map((num) => (

                  <button
                    key={num}
                    className={
                      variables === num
                        ? "variable-card selected"
                        : "variable-card"
                    }
                    onClick={() => setVariables(num)}
                  >

                    <div className="variable-icon">
                      {num === 2
                        ? "AB"
                        : num === 3
                        ? "ABC"
                        : "ABCD"}
                    </div>

                    <h3>
                      {num} Variables
                    </h3>

                    <p>
                      {Math.pow(2, num)} truth table combinations
                    </p>

                    {variables === num && (
                      <div className="selected-label">
                        Selected ✓
                      </div>
                    )}

                  </button>

                ))}

              </div>

            </section>


            {/* NEXT STEP */}

            {variables && (

              <section className="next-section">

                <div>

                  <span className="ready-label">
                    READY TO BEGIN
                  </span>

                  <h2>
                    Let's build your {variables}-variable function.
                  </h2>

                  <p>
                    The truth table will be generated automatically.
                    You only need to enter the F values.
                  </p>

                </div>

                <button
                  className="primary-button"
                  onClick={() => setPage("truth")}
                >
                  Generate Truth Table
                  <span>→</span>
                </button>

              </section>

            )}


            {/* WORKFLOW */}

            <section className="workflow">

              <div className="workflow-title">
                <h2>How LogicMin Works</h2>
              </div>


              <div className="workflow-cards">

                <div className="workflow-card">

                  <span>01</span>

                  <Table2 size={28} />

                  <h3>Truth Table</h3>

                  <p>
                    Enter only the output F values.
                  </p>

                </div>


                <div className="arrow">
                  →
                </div>


                <div className="workflow-card">

                  <span>02</span>

                  <Grid2X2 size={28} />

                  <h3>K-Map</h3>

                  <p>
                    Automatically map and group minterms.
                  </p>

                </div>


                <div className="arrow">
                  →
                </div>


                <div className="workflow-card">

                  <span>03</span>

                  <FunctionSquare size={28} />

                  <h3>Minimize</h3>

                  <p>
                    Generate the simplified Boolean expression.
                  </p>

                </div>


                <div className="arrow">
                  →
                </div>


                <div className="workflow-card">

                  <span>04</span>

                  <CircuitBoard size={28} />

                  <h3>Circuit</h3>

                  <p>
                    Automatically construct the logic circuit.
                  </p>

                </div>

              </div>

            </section>

          </>

        )}

      </main>

    </div>
  );
}

export default App;