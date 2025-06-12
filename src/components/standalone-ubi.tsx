import { component$, useStore } from "@builder.io/qwik";

export const StandaloneUbi = component$(() => {
  console.log("StandaloneUbi component rendering");
  
  // Create a simple store with mock data
  const store = useStore({
    year: 2023,
    ubiAmount: 2000,
    flatTaxPercentage: 30,
    taxpayersPerQuintile: 6140,
    quintiles: [
      { quintile: 1, income: 10, tax: 0 },
      { quintile: 2, income: 30, tax: 2 },
      { quintile: 3, income: 50, tax: 5.5 },
      { quintile: 4, income: 75, tax: 11 },
      { quintile: 5, income: 200, tax: 35 }
    ]
  });
  
  // Calculate UBI income for each quintile
  const yearlyUbiInThousands = (store.ubiAmount * 12) / 1000;
  const incomesWithUbi = store.quintiles.map(q => ({
    quintile: q.quintile,
    income: q.income,
    withUbi: q.income + yearlyUbiInThousands
  }));
  
  return (
    <div style="background-color: rgb(240, 240, 255); padding: 20px; margin: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="margin-bottom: 16px;">UBI Calculation (Standalone)</h2>
      
      <div style="margin-bottom: 16px;">
        <h3>Data for {store.year}</h3>
        <p>UBI Amount: ${store.ubiAmount} per month</p>
        <p>Flat Tax: {store.flatTaxPercentage}%</p>
        <p>Taxpayers per Quintile: {store.taxpayersPerQuintile * 1000}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Quintile</th>
            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Income</th>
            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Tax</th>
            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Income with UBI</th>
          </tr>
        </thead>
        <tbody>
          {store.quintiles.map((q, index) => (
            <tr key={index} style={index % 2 === 0 ? "background-color: #f9f9f9;" : ""}>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Q{q.quintile}</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${q.income}k</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${q.tax}k</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${incomesWithUbi.find(i => i.quintile === q.quintile)?.withUbi}k</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style="font-style: italic; font-size: 0.9em;">
        <p>* All values are in thousands of dollars.</p>
      </div>
    </div>
  );
});
