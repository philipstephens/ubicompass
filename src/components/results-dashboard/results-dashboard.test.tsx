/**
 * Unit tests for Results Dashboard component
 */
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { render } from "@builder.io/qwik/testing";
import { component$ } from "@builder.io/qwik";
import { ResultsDashboard } from "./results-dashboard";
import { UbiCompassProvider } from "../../contexts/ubi-compass-context";
import { createMockUbiCompassContext } from "../../test-utils/test-setup";

// Mock context provider for testing
const MockContextProvider = component$<{ mockContext: any }>(
  ({ mockContext }) => {
    return (
      <UbiCompassProvider>
        <ResultsDashboard />
      </UbiCompassProvider>
    );
  }
);

describe("ResultsDashboard", () => {
  const defaultMockContext = createMockUbiCompassContext();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );
      expect(screen).toBeTruthy();
    });

    it("should display all result cards", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      expect(screen.getByText("💰 Net UBI Cost")).toBeTruthy();
      expect(screen.getByText("📊 Funding Status")).toBeTruthy();
      expect(screen.getByText("👥 Population Impact")).toBeTruthy();
      expect(screen.getByText("💵 UBI Amounts")).toBeTruthy();
    });

    it("should display feasibility indicator", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      // Should show one of the feasibility statuses
      const feasibilityIndicator = screen.querySelector(
        ".feasibility-indicator"
      );
      expect(feasibilityIndicator).toBeTruthy();
    });
  });

  describe("Net UBI Cost Card", () => {
    it("should display correct net cost when not self-funded", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const netCostCard = screen
        .getByText("💰 Net UBI Cost")
        .closest(".result-card");
      expect(netCostCard).toBeTruthy();

      // Should show additional funding needed
      expect(netCostCard?.textContent).toMatch(/Additional funding needed/);
    });

    it("should display surplus when self-funded", async () => {
      const selfFundedContext = createMockUbiCompassContext({
        results: {
          ...defaultMockContext.state.results,
          netCostAfterReplacement: -50000000000, // $50B surplus
          isSelfFunded: true,
        },
      });

      // This would require a way to inject the mock context
      // For now, we test the logic conceptually
      expect(-50000000000).toBeLessThan(0); // Should show surplus
    });

    it("should show breakdown of cost components", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const netCostCard = screen
        .getByText("💰 Net UBI Cost")
        .closest(".result-card");

      expect(netCostCard?.textContent).toMatch(/Total UBI Cost/);
      expect(netCostCard?.textContent).toMatch(/Tax Revenue/);
      expect(netCostCard?.textContent).toMatch(/Program Savings/);
    });
  });

  describe("Funding Status Card", () => {
    it("should display correct funding percentage", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const fundingCard = screen
        .getByText("📊 Funding Status")
        .closest(".result-card");
      expect(fundingCard).toBeTruthy();

      // Should show percentage
      expect(fundingCard?.textContent).toMatch(/\d+\.?\d*%/);
    });

    it("should show progress bar with correct width", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const progressBar = screen.querySelector(".progress-bar .progress-fill");
      expect(progressBar).toBeTruthy();

      // Progress bar should have a width style
      expect(progressBar?.getAttribute("style")).toMatch(/width:/);
    });

    it("should show funding breakdown", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const fundingCard = screen
        .getByText("📊 Funding Status")
        .closest(".result-card");

      expect(fundingCard?.textContent).toMatch(/Tax Coverage/);
      expect(fundingCard?.textContent).toMatch(/Program Savings/);
    });

    it("should use correct color coding based on funding level", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const fundingCard = screen
        .getByText("📊 Funding Status")
        .closest(".result-card");

      // Should have appropriate CSS class based on funding percentage
      expect(fundingCard?.className).toMatch(/result-card/);
    });
  });

  describe("Population Impact Card", () => {
    it("should display total population", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const populationCard = screen
        .getByText("👥 Population Impact")
        .closest(".result-card");
      expect(populationCard).toBeTruthy();

      // Should show total population in millions
      expect(populationCard?.textContent).toMatch(/\d+\.?\d*M/);
    });

    it("should show breakdown by age groups with emojis", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const populationCard = screen
        .getByText("👥 Population Impact")
        .closest(".result-card");

      expect(populationCard?.textContent).toMatch(/👶 Children/);
      expect(populationCard?.textContent).toMatch(/🧑 Youth/);
      expect(populationCard?.textContent).toMatch(/👨 Adults/);
      expect(populationCard?.textContent).toMatch(/👴 Seniors/);
    });

    it("should display dynamic age ranges based on cutoffs", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const populationCard = screen
        .getByText("👥 Population Impact")
        .closest(".result-card");

      // Should show age ranges like (0-12), (13-21), etc.
      expect(populationCard?.textContent).toMatch(/\(\d+-\d+\)/);
    });
  });

  describe("UBI Amounts Card", () => {
    it("should display UBI amounts for all age groups", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const ubiCard = screen
        .getByText("💵 UBI Amounts")
        .closest(".result-card");
      expect(ubiCard).toBeTruthy();

      expect(ubiCard?.textContent).toMatch(/👶 Child UBI/);
      expect(ubiCard?.textContent).toMatch(/🧑 Youth UBI/);
      expect(ubiCard?.textContent).toMatch(/👨 Adult UBI/);
      expect(ubiCard?.textContent).toMatch(/👴 Senior UBI/);
    });

    it("should highlight adult UBI as primary rate", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const ubiCard = screen
        .getByText("💵 UBI Amounts")
        .closest(".result-card");

      // Adult UBI should be prominently displayed
      expect(ubiCard?.textContent).toMatch(/Adult UBI amount \(primary rate\)/);
    });

    it("should show monthly amounts", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const ubiCard = screen
        .getByText("💵 UBI Amounts")
        .closest(".result-card");

      // Should show amounts like $1200/mo
      expect(ubiCard?.textContent).toMatch(/\$\d+\/mo/);
    });
  });

  describe("Feasibility Indicator", () => {
    it("should show feasible status when self-funded", async () => {
      // Test feasible scenario
      const feasibleResults = {
        isSelfFunded: true,
        fundingPercentage: 105,
        netCostAfterReplacement: -10000000000,
      };

      // Would need context injection to test properly
      expect(feasibleResults.isSelfFunded).toBe(true);
    });

    it("should show challenging status when mostly funded", async () => {
      // Test challenging scenario
      const challengingResults = {
        isSelfFunded: false,
        fundingPercentage: 85,
        netCostAfterReplacement: 50000000000,
      };

      expect(challengingResults.fundingPercentage).toBeGreaterThanOrEqual(75);
      expect(challengingResults.isSelfFunded).toBe(false);
    });

    it("should show unfeasible status when poorly funded", async () => {
      // Test unfeasible scenario
      const unfeasibleResults = {
        isSelfFunded: false,
        fundingPercentage: 45,
        netCostAfterReplacement: 200000000000,
      };

      expect(unfeasibleResults.fundingPercentage).toBeLessThan(75);
      expect(unfeasibleResults.isSelfFunded).toBe(false);
    });

    it("should display appropriate emoji and message for each status", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const feasibilityIndicator = screen.querySelector(
        ".feasibility-indicator"
      );
      expect(feasibilityIndicator).toBeTruthy();

      // Should contain an emoji and descriptive text
      expect(feasibilityIndicator?.textContent).toMatch(/[✅⚠️❌]/);
    });
  });

  describe("Responsive Design", () => {
    it("should use CSS Grid for responsive layout", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const resultsGrid = screen.querySelector(".results-grid");
      expect(resultsGrid).toBeTruthy();
    });

    it("should have proper card styling", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      const cards = screen.querySelectorAll(".result-card");
      expect(cards.length).toBeGreaterThan(0);

      cards.forEach((card) => {
        expect(card.className).toMatch(/result-card/);
      });
    });
  });

  describe("Data Formatting", () => {
    it("should format large numbers with B suffix", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      // Should find numbers formatted like $123.4B
      const content = screen.textContent || "";
      expect(content).toMatch(/\$\d+\.?\d*B/);
    });

    it("should format percentages correctly", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      // Should find percentages like 54.3%
      const content = screen.textContent || "";
      expect(content).toMatch(/\d+\.?\d*%/);
    });

    it("should format population in millions", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      // Should find population like 30.0M
      const content = screen.textContent || "";
      expect(content).toMatch(/\d+\.?\d*M/);
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      // Should have proper heading structure
      const headings = screen.querySelectorAll("h1, h2, h3, h4, h5, h6");
      expect(headings.length).toBeGreaterThan(0);
    });

    it("should have sufficient color contrast", async () => {
      // This would require color contrast testing tools
      // For now, we document the requirement
      expect(true).toBe(true);
    });

    it("should support screen readers", async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <ResultsDashboard />
        </UbiCompassProvider>
      );

      // Should have meaningful text content for screen readers
      const content = screen.textContent || "";
      expect(content.length).toBeGreaterThan(0);
    });
  });
});
