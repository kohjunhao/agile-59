document.addEventListener("DOMContentLoaded", () => {
    /** Mortgage Calculator **/
    const mortgageForm = document.getElementById("mortgage-form");

    mortgageForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const loanAmount = parseFloat(document.getElementById("loan_amount").value);
        const interestRate = parseFloat(document.getElementById("interest_rate").value);
        const durationYears = parseInt(document.getElementById("duration_years").value);

        if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(durationYears) || loanAmount <= 0 || interestRate <= 0 || durationYears <= 0) {
            alert("Please enter valid values.");
            return;
        }

        try {
            const response = await fetch(`/tools/mortgage-calculator?loan_amount=${loanAmount}&interest_rate=${interestRate}&duration_years=${durationYears}`);
            const data = await response.json();

            if (data.error) {
                console.error("API Error:", data.error);
                alert("Error: " + data.error);
                return;
            }

            document.getElementById("monthly_payment").innerText = `$${data.monthly_payment.total}`;
            document.getElementById("annual_payment").innerText = `$${data.annual_payment.total}`;
            document.getElementById("total_interest").innerText = `$${data.total_interest_paid}`;
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("Failed to fetch mortgage details.");
        }
    });

    /** Affordability Calculator **/
    const affordabilityForm = document.getElementById("affordability-form");

    affordabilityForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const monthlyIncome = parseFloat(document.getElementById("monthly_income").value);
        const otherDebts = parseFloat(document.getElementById("other_debts").value) || 0;
        const downpayment = parseFloat(document.getElementById("downpayment").value) || 0;
        const interestRate = parseFloat(document.getElementById("interest_rate_afford").value);
        const durationYears = parseInt(document.getElementById("duration_years_afford").value);

        if (isNaN(monthlyIncome) || isNaN(interestRate) || isNaN(durationYears) || monthlyIncome <= 0 || interestRate <= 0 || durationYears <= 0) {
            alert("Please enter valid values.");
            return;
        }

        const maxMonthlyPayment = (monthlyIncome * 0.28) - otherDebts;

        try {
            const response = await fetch(`/tools/mortgage-calculator?interest_rate=${interestRate}&duration_years=${durationYears}&loan_amount=500000`);
            const data = await response.json();

            if (data.error) {
                console.error("API Error:", data.error);
                alert("Error: " + data.error);
                return;
            }

            const sampleMonthlyPayment = data.monthly_payment.total;
            const estimatedLoanAmount = (maxMonthlyPayment / sampleMonthlyPayment) * 500000;
            const maxHomePrice = estimatedLoanAmount + downpayment;

            document.getElementById("max_home_price").innerText = `$${maxHomePrice.toFixed(2)}`;
            document.getElementById("afford_loan_amount").innerText = `$${estimatedLoanAmount.toFixed(2)}`;
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("Failed to fetch affordability details.");
        }
    });

    /** Stamp Duty Calculator **/
    const stampDutyForm = document.getElementById("stamp-duty-form");

    stampDutyForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        let propertyPrice = parseFloat(document.getElementById("property_price").value);

        if (isNaN(propertyPrice) || propertyPrice <= 0) {
            alert("Please enter a valid property price.");
            return;
        }

        try {
            const response = await fetch(`/tools/stamp-duty-calculator?property_price=${propertyPrice}`);
            const data = await response.json();

            if (data.error) {
                alert("Error: " + data.error);
                return;
            }

            document.getElementById("stamp_duty").innerText = `$${data.stampDuty.toFixed(2)}`;
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("Failed to fetch stamp duty details.");
        }
    });
});