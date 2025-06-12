import { component$, QRL } from "@builder.io/qwik";
import type { TaxationModel } from "../models/taxation";
import "./taxation-model-selector.css";

interface TaxationModelSelectorProps {
  taxationModels: TaxationModel[];
  selectedModelId: number;
  modelDescription: string | null;
  onModelChange$: QRL<(event: Event) => void>;
}

export const TaxationModelSelector = component$<TaxationModelSelectorProps>(
  ({ taxationModels, selectedModelId, modelDescription, onModelChange$ }) => {
    return (
      <div class="taxation-model-selector">
        <div class="form-row">
          <label for="model-select">Taxation Model = </label>
          <select
            id="model-select"
            value={selectedModelId}
            onChange$={onModelChange$}
          >
            {taxationModels.map((model) => (
              <option key={model.model_id} value={model.model_id}>
                {model.model_name}
              </option>
            ))}
          </select>

          {modelDescription && (
            <div class="model-info">{modelDescription}</div>
          )}
        </div>
      </div>
    );
  }
);
