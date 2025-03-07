const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = "HCXiqr+rS0oZNMAa5uiMPQ==5DmxA75Yn4Im9Lnu";
const API_URL = "https://api.api-ninjas.com/v1/mortgagecalculator";

// Render the Tools Page
router.get("/", (req, res) => {
    res.render("tools.ejs");
});

// Handle Mortgage API Requests
router.get("/mortgage-calculator", async (req, res) => {
    try {
        const { loan_amount, interest_rate, duration_years } = req.query;

        if (!loan_amount || !interest_rate || !duration_years) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const response = await axios.get(API_URL, {
            params: { loan_amount, interest_rate, duration_years },
            headers: { "X-Api-Key": API_KEY }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Mortgage API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch mortgage data" });
    }
});

// Handle Affordability Calculator Request
router.get("/affordability-calculator", async (req, res) => {
    try {
        const { monthly_income, other_debts, downpayment, interest_rate, duration_years } = req.query;

        if (!monthly_income || !interest_rate || !duration_years) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const maxMonthlyPayment = (monthly_income * 0.28) - (other_debts || 0);

        // Use API Ninja's Mortgage Calculator API with a sample loan amount
        const response = await axios.get(API_URL, {
            params: { loan_amount: 500000, interest_rate, duration_years },
            headers: { "X-Api-Key": API_KEY }
        });

        if (!response.data || !response.data.monthly_payment) {
            return res.status(500).json({ error: "Failed to fetch affordability details" });
        }

        const monthlyPayment = response.data.monthly_payment.total;
        const estimatedLoanAmount = (maxMonthlyPayment / monthlyPayment) * 500000;
        const maxHomePrice = estimatedLoanAmount + (downpayment || 0);

        res.json({ maxHomePrice, estimatedLoanAmount });
    } catch (error) {
        console.error("Affordability API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch affordability data" });
    }
});

// Handle Stamp Duty Calculator Request (Singapore BSD Rates)
router.get("/stamp-duty-calculator", (req, res) => {
    try {
        let { property_price } = req.query;
        property_price = parseFloat(property_price);

        if (!property_price || property_price <= 0) {
            return res.status(400).json({ error: "Invalid property price" });
        }

        let stampDuty = 0;
        if (property_price > 1000000) {
            stampDuty += (property_price - 1000000) * 0.04;
            property_price = 1000000;
        }
        if (property_price > 360000) {
            stampDuty += (property_price - 360000) * 0.03;
            property_price = 360000;
        }
        if (property_price > 180000) {
            stampDuty += (property_price - 180000) * 0.02;
            property_price = 180000;
        }
        stampDuty += property_price * 0.01;

        res.json({ stampDuty });
    } catch (error) {
        console.error("Stamp Duty API Error:", error.message);
        res.status(500).json({ error: "Failed to calculate stamp duty" });
    }
});

module.exports = router;