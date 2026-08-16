import { ArrowRight } from "lucide-react";

import { MODEL_STAGES } from "@/lib/demo/model";

export function ModelMap() {
  return (
    <section className="model-map" aria-labelledby="model-map-title">
      <div className="model-map-heading">
        <div>
          <p className="eyebrow">The model in one line</p>
          <h2 id="model-map-title">From scattered signal to governed learning.</h2>
        </div>
        <p>
          AI may organize and explain evidence. Fixed rules and accountable humans own every
          consequential decision.
        </p>
      </div>
      <ol className="model-stage-rail">
        {MODEL_STAGES.map((stage, index) => (
          <li key={stage.id}>
            <article>
              <div className="model-stage-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage.output}</strong>
              </div>
              <h3>{stage.label}</h3>
              <p className="model-question">{stage.question}</p>
              <p>{stage.explanation}</p>
              <ul>
                {stage.exampleInputs.map((input) => <li key={input}>{input}</li>)}
              </ul>
            </article>
            {index < MODEL_STAGES.length - 1 ? <ArrowRight className="model-arrow" aria-hidden="true" size={18} /> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
