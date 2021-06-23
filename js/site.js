// build an table of payments
function submitForm() {
    // Build you amorization schedule, what do you do when you get payments
    let loan = Number(document.getElementById("loan").value);
    let term = 12 * parseInt(document.getElementById("term").value);
    let rate = parseFloat(document.getElementById("rate").value);
    rate = rateFind(rate);

    let paymentValue = totalMonthlyPayment(loan, term, rate);
    let monthlyPayment = adjustedPayment(loan, term, rate, paymentValue);
    displayData(monthlyPayment);
}

function adjustedPayment(loan, term, rate, paymentValue) {
    // push array below to capture data
    //payment Data Set - this object contains an array of other objects, and an additional object that holds the summary info
    let paymentDS = {
        paymentRow: [],
        summary: {}
    }


    let balance = loan;
    let totalInterest = 0;
    let monthPrincipal = 0;
    let monthInterest = 0;
    // let monthTotalInterest = 0;


    for (month = 1; month <= term; month++) {
        monthInterest = interestPayment(balance, rate);
        totalInterest += monthInterest;
        monthPrincipal = paymentValue - monthInterest;
        balance = balance - monthPrincipal;


        let mortgageTable = {
            month: month,
            payment: paymentValue,
            principal: monthPrincipal,
            interest: monthInterest,
            totalInterest: totalInterest,
            balance: balance
        }
        paymentDS.paymentRow.push(mortgageTable);
    }

    let summary = {
        monthlyPayment: paymentValue,
        totalPrincipal: loan,
        totalInterest: totalInterest,
        totalCost: (loan + totalInterest)
    };
    paymentDS.summary = summary;
    return paymentDS;
}


function displayData(monthlyPayment) {
    const template = document.getElementById("tableValues");
    const resultsBody = document.getElementById("resultsBody");
    // clear table first
    resultsBody.innerHTML = "";

    for (let i = 0; i < monthlyPayment.paymentRow.length; i++) {

        payRow = template.content.cloneNode(true);
        //grab only the columns in the template
        paycols = payRow.querySelectorAll("td");
        // apply items into array based on objects we refer to
        paycols[0].textContent = monthlyPayment.paymentRow[i].month;
        paycols[1].textContent = monthlyPayment.paymentRow[i].payment.toFixed(2);
        paycols[2].textContent = monthlyPayment.paymentRow[i].principal.toFixed(2);
        paycols[3].textContent = monthlyPayment.paymentRow[i].interest.toFixed(2);
        paycols[4].textContent = monthlyPayment.paymentRow[i].totalInterest.toFixed(2);
        paycols[5].textContent = monthlyPayment.paymentRow[i].balance.toFixed(2);

        resultsBody.appendChild(payRow);
    }

    //total interest is in the last row of the payments array.

    let totalInterest = monthlyPayment.summary.totalInterest;
    let payment = monthlyPayment.summary.monthlyPayment;
    let loanAmount = monthlyPayment.summary.totalPrincipal;
    let totalCost = monthlyPayment.summary.totalCost;

    //Build out the summary area
    let labelPrincipal = document.getElementById("totalPrincipal");
    labelPrincipal.innerHTML = Number(loanAmount).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

    let labelInterest = document.getElementById("totalInterest");
    labelInterest.innerHTML = Number(totalInterest).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

    let paymentdiv = document.getElementById("payment");
    paymentdiv.innerHTML = Number(payment).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

    let totalCostDiv = document.getElementById("totalCost");

    totalCostDiv.innerHTML = Number(totalCost).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

}






// Mortgage EQUATIONS
function totalMonthlyPayment(loan, term, rate) {
    return (loan * rate) / (1 - Math.pow(1 + rate, -term));
}

function interestPayment(remainingBalance, rate) {
    return remainingBalance * rate;
}

function principalPayment(monthlyPayment, intPayment) {
    return (monthlyPayment) - (intPayment);
}

function endMonthBalance(previousBalance, princPayment) {
    let balance = (previousBalance) - (princPayment);
    return (balance);
}

function rateFind(rate) {
    return (rate / 1200);
}
