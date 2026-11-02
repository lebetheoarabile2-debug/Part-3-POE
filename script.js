let attempts = Number(localStorage.getItem("enquiryAttempts")) || 0;
let enquiries = [];
localStorage.removeItem("enquiryAttempts");
localStorage.removeItem("enquiryLockoutUntil");

let lockoutUntil = Number(localStorage.getItem("enquiryLockoutUntil")) || 0;
const LOCKOUT_TIME = 30 * 60 * 1000;

const enquiryForm = document.getElementById("enquiryForm");
const formMessage = document.getElementById("formMessage");

if (enquiryForm && formMessage) {
    enquiryForm.addEventListener("submit", function(event) {
        event.preventDefault();

      
        if (lockoutUntil > Date.now()) {
            formMessage.textContent =
                "Too many failed attempts. Please try again after 30 minutes.";
            formMessage.className = "form-message error";
            return;
        }

        
        if (lockoutUntil !== 0 && Date.now() >= lockoutUntil) {
            attempts = 0;
            lockoutUntil = 0;
            localStorage.removeItem("enquiryAttempts");
            localStorage.removeItem("enquiryLockoutUntil");
        }

        const fields = enquiryForm.querySelectorAll(
            "input[required], select[required], textarea[required]"
        );

        const email = document.getElementById("email");
        const phone = document.getElementById("phone");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\+27[0-9]{9}$/;

        let isValid = true;
        let errorMessage = "Please complete all required fields.";

        
        fields.forEach(function(field) {
            if (field.value.trim() === "") {
                field.classList.add("invalid-field");
                isValid = false;
            } else {
                field.classList.remove("invalid-field");
            }
        });

        
        if (email && email.value.trim() !== "" &&
            !emailPattern.test(email.value.trim())) {
            email.classList.add("invalid-field");
            isValid = false;
            errorMessage = "Please enter a valid email address, e.g. name@example.com.";
        }

       
        if (phone && phone.value.trim() !== "" &&
            !phonePattern.test(phone.value.trim())) {
            phone.classList.add("invalid-field");
            isValid = false;
            errorMessage = "Enter a valid phone number: +27 followed by 9 digits.";
        }

       
        if (!isValid) {
            attempts++;
            localStorage.setItem("enquiryAttempts", attempts);

            if (attempts >= 3) {
                lockoutUntil = Date.now() + LOCKOUT_TIME;
                localStorage.setItem("enquiryLockoutUntil", lockoutUntil);

                formMessage.textContent =
                    "Too many failed attempts. Please try again after 30 minutes.";
            } else {
                formMessage.textContent =
                    errorMessage + " Failed attempts: " + attempts + " of 3.";
            }

            formMessage.className = "form-message error";
        } else {
            attempts = 0;
            lockoutUntil = 0;

            localStorage.removeItem("enquiryAttempts");
            localStorage.removeItem("enquiryLockoutUntil");

            formMessage.textContent = "All required fields are completed correctly! Enquiry Submited";
            formMessage.className = "form-message success";
        }
    });
}

const practiceGrade = document.getElementById("practiceGrade");
const practiceTopic = document.getElementById("practiceTopic");
const startPractice = document.getElementById("startPractice");
const practiceQuestion = document.getElementById("practiceQuestion");

// Each question: question, options, correct option index, explanation
const mathsQuestions = {
    "11": {
        algebra: [
            ["Solve: 2x + 6 = 16", ["3", "5", "8", "11"], 1, "Subtract 6, then divide by 2. x = 5."],
            ["Solve: 3x - 7 = 11", ["4", "5", "6", "7"], 2, "3x = 18, so x = 6."],
            ["Factorise: x² + 5x + 6", ["(x+1)(x+6)", "(x+2)(x+3)", "(x-2)(x-3)", "(x+5)(x+1)"], 1, "Find numbers that multiply to 6 and add to 5: 2 and 3."],
            ["Simplify: 4a + 3a - 2a", ["5a", "9a", "7a", "a"], 0, "Combine like terms: 4 + 3 - 2 = 5."],
            ["Solve: x² = 49", ["7 only", "-7 only", "±7", "49"], 2, "Both 7² and (-7)² equal 49."],
            ["Expand: 3(x + 4)", ["3x + 4", "3x + 12", "x + 12", "7x"], 1, "Multiply 3 by both terms."],
            ["Simplify: (x³)(x²)", ["x⁵", "x⁶", "x", "2x⁵"], 0, "When multiplying powers with the same base, add exponents."],
            ["Solve: 5x = 35", ["5", "6", "7", "8"], 2, "Divide both sides by 5."],
            ["Factorise: x² - 16", ["(x-8)(x+2)", "(x-4)(x+4)", "(x-4)²", "(x+4)²"], 1, "Use the difference of two squares."],
            ["Simplify: 12x² ÷ 3x", ["4x", "4x²", "9x", "4"], 0, "12 ÷ 3 = 4 and x² ÷ x = x."]
        ],
        functions: [
            ["If f(x)=2x+3, find f(4).", ["7", "8", "11", "14"], 2, "Substitute 4: 2(4)+3 = 11."],
            ["If f(x)=x², find f(3).", ["6", "9", "3", "12"], 1, "3² = 9."],
            ["Find the y-intercept of y=2x+5.", ["2", "5", "-5", "0"], 1, "Set x = 0; y = 5."],
            ["What is the gradient of y=3x-2?", ["-2", "2", "3", "-3"], 2, "The coefficient of x is the gradient."],
            ["If f(x)=x-7, find f(10).", ["3", "7", "17", "-3"], 0, "10 - 7 = 3."],
            ["Which point lies on y=x+2?", ["(1,1)", "(2,4)", "(3,4)", "(0,1)"], 1, "For x = 2, y = 2 + 2 = 4."],
            ["What is the x-intercept of y=x-4?", ["(0,-4)", "(4,0)", "(0,4)", "(-4,0)"], 1, "Set y = 0: x - 4 = 0, so x = 4."],
            ["If f(x)=2x², find f(2).", ["4", "6", "8", "16"], 2, "2(2²) = 8."],
            ["A straight-line graph with positive gradient:", ["Falls left to right", "Rises left to right", "Is always horizontal", "Is always vertical"], 1, "A positive gradient means the graph rises from left to right."],
            ["If y=4x, find y when x=3.", ["7", "12", "16", "1"], 1, "4 × 3 = 12."]
        ],
        trigonometry: [
            ["sin θ equals:", ["Adjacent/Hypotenuse", "Opposite/Hypotenuse", "Opposite/Adjacent", "Hypotenuse/Opposite"], 1, "SOH: sine = opposite ÷ hypotenuse."],
            ["cos θ equals:", ["Opposite/Hypotenuse", "Opposite/Adjacent", "Adjacent/Hypotenuse", "Hypotenuse/Adjacent"], 2, "CAH: cosine = adjacent ÷ hypotenuse."],
            ["tan θ equals:", ["Opposite/Adjacent", "Adjacent/Hypotenuse", "Opposite/Hypotenuse", "Hypotenuse/Opposite"], 0, "TOA: tangent = opposite ÷ adjacent."],
            ["What is sin 30°?", ["0", "1/2", "√3/2", "1"], 1, "sin 30° = 1/2."],
            ["What is cos 60°?", ["1", "√3/2", "1/2", "0"], 2, "cos 60° = 1/2."],
            ["What is tan 45°?", ["0", "1/2", "1", "√3"], 2, "tan 45° = 1."],
            ["In a right triangle, the hypotenuse is:", ["Opposite the right angle", "Next to the smallest angle", "Always vertical", "The shortest side"], 0, "The hypotenuse is opposite the 90° angle."],
            ["If opposite = 3 and hypotenuse = 5, sin θ = ?", ["3/5", "5/3", "3/4", "4/5"], 0, "Sine = opposite ÷ hypotenuse = 3/5."],
            ["What is sin 90°?", ["0", "1/2", "1", "√3/2"], 2, "sin 90° = 1."],
            ["If tan θ = 1 for an acute angle, θ = ?", ["30°", "45°", "60°", "90°"], 1, "tan 45° = 1."]
        ],
        geometry: [
            ["Angles inside a triangle add up to:", ["90°", "180°", "270°", "360°"], 1, "The interior angles of a triangle total 180°."],
            ["An isosceles triangle has:", ["Three equal sides", "Two equal sides", "No equal sides", "Four equal sides"], 1, "An isosceles triangle has at least two equal sides."],
            ["Vertically opposite angles are:", ["Supplementary always", "Equal", "Always 90°", "Always acute"], 1, "Vertically opposite angles are equal."],
            ["Angles on a straight line total:", ["90°", "180°", "270°", "360°"], 1, "Angles on a straight line add up to 180°."],
            ["The exterior angle of a triangle equals:", ["One interior angle", "The sum of two opposite interior angles", "360°", "90° always"], 1, "An exterior angle equals the sum of the two opposite interior angles."],
            ["A right angle measures:", ["45°", "90°", "180°", "360°"], 1, "A right angle measures 90°."],
            ["The sum of angles in a quadrilateral is:", ["180°", "270°", "360°", "540°"], 2, "A quadrilateral's interior angles total 360°."],
            ["If two angles in a triangle are 50° and 60°, the third is:", ["60°", "70°", "80°", "90°"], 1, "180° - 50° - 60° = 70°."],
            ["A radius joins the centre of a circle to:", ["A tangent", "A point on the circumference", "Another circle", "A chord's midpoint only"], 1, "A radius runs from the centre to the circumference."],
            ["A diameter is equal to:", ["Half the radius", "Twice the radius", "Three times the radius", "The circumference"], 1, "Diameter = 2 × radius."]
        ]
    },

    "12": {
        algebra: [
            ["Solve: x² - 9 = 0", ["x=3 only", "x=-3 only", "x=±3", "x=9"], 2, "x² = 9, so x = 3 or x = -3."],
            ["Solve: 2x² = 18", ["x=3 only", "x=±3", "x=±9", "x=9"], 1, "x² = 9, so x = ±3."],
            ["Factorise: x² - 5x + 6", ["(x-2)(x-3)", "(x+2)(x+3)", "(x-1)(x-6)", "(x+1)(x-6)"], 0, "-2 and -3 multiply to 6 and add to -5."],
            ["Solve: x² - 4x = 0", ["x=4 only", "x=0 only", "x=0 or 4", "x=±2"], 2, "Factorise x(x-4)=0."],
            ["Simplify: (x⁴)(x³)", ["x⁷", "x¹²", "x", "2x⁷"], 0, "Add exponents when multiplying like bases."],
            ["Expand: (x+2)(x+3)", ["x²+5x+6", "x²+6", "x²+6x+5", "x²+5"], 0, "Multiply and collect terms: x² + 5x + 6."],
            ["Solve: 3x - 8 = 10", ["4", "5", "6", "7"], 2, "3x = 18, so x = 6."],
            ["What is √81?", ["8", "9", "27", "40.5"], 1, "9 × 9 = 81."],
            ["Solve: (x-5)(x+2)=0", ["x=5 only", "x=-2 only", "x=5 or -2", "x=3"], 2, "Set each factor equal to zero."],
            ["Simplify: 15a³ ÷ 5a", ["3a²", "3a³", "10a²", "3a⁴"], 0, "15 ÷ 5 = 3 and a³ ÷ a = a²."]
        ],
        functions: [
            ["Find the y-intercept of f(x)=2x-5.", ["2", "-5", "5", "-2"], 1, "Set x = 0, giving y = -5."],
            ["For f(x)=x², find f(-3).", ["-9", "6", "9", "-6"], 2, "(-3)² = 9."],
            ["What is the gradient of y=-4x+7?", ["7", "-4", "4", "-7"], 1, "The coefficient of x is -4."],
            ["Where does y=x+3 cross the y-axis?", ["(3,0)", "(0,3)", "(0,-3)", "(-3,0)"], 1, "Set x = 0; y = 3."],
            ["If f(x)=3x², find f(2).", ["6", "9", "12", "18"], 2, "3(2²) = 12."],
            ["Which is a horizontal line?", ["y=2x", "x=4", "y=4", "y=x+4"], 2, "y = 4 has a constant y-value."],
            ["The axis of symmetry of y=x² is:", ["x=0", "y=0", "x=1", "y=1"], 0, "The graph y = x² is symmetric about the y-axis, x = 0."],
            ["If f(x)=x-6, solve f(x)=0.", ["x=0", "x=6", "x=-6", "x=1"], 1, "x - 6 = 0, so x = 6."],
            ["A negative gradient means the line:", ["Rises left to right", "Falls left to right", "Is horizontal", "Is vertical"], 1, "A negative gradient means the line falls from left to right."],
            ["For y=x²-4, the y-intercept is:", ["-4", "0", "2", "4"], 0, "Set x = 0, giving y = -4."]
        ],
        trigonometry: [
            ["What is sin 30°?", ["0", "1/2", "√3/2", "1"], 1, "sin 30° = 1/2."],
            ["What is cos 60°?", ["0", "1/2", "√3/2", "1"], 1, "cos 60° = 1/2."],
            ["What is tan 45°?", ["0", "1/2", "1", "√3"], 2, "tan 45° = 1."],
            ["What is sin 90°?", ["0", "1/2", "1", "-1"], 2, "sin 90° = 1."],
            ["What is cos 0°?", ["0", "1/2", "1", "-1"], 2, "cos 0° = 1."],
            ["What is tan 0°?", ["0", "1", "undefined", "-1"], 0, "tan 0° = 0."],
            ["If sin θ = 1/2 and θ is acute, θ = ?", ["30°", "45°", "60°", "90°"], 0, "sin 30° = 1/2."],
            ["In a right triangle, cos θ = ?", ["Opposite/Hypotenuse", "Adjacent/Hypotenuse", "Opposite/Adjacent", "Hypotenuse/Adjacent"], 1, "CAH: cosine = adjacent ÷ hypotenuse."],
            ["The period of y = sin x in degrees is:", ["90°", "180°", "270°", "360°"], 3, "The sine graph repeats every 360°."],
            ["If tan θ = 1 and θ is acute, θ = ?", ["30°", "45°", "60°", "90°"], 1, "tan 45° = 1."]
        ],
        geometry: [
            ["A tangent meets a radius at the point of contact at:", ["45°", "60°", "90°", "180°"], 2, "A tangent is perpendicular to the radius at the point of contact."],
            ["The angle at the centre is how many times the angle at the circumference subtended by the same arc?", ["The same", "Twice", "Three times", "Half"], 1, "The angle at the centre is twice the angle at the circumference."],
            ["Angles in the same segment of a circle are:", ["Supplementary", "Equal", "Always 90°", "Always acute"], 1, "Angles subtended by the same chord in the same segment are equal."],
            ["Opposite angles of a cyclic quadrilateral add up to:", ["90°", "180°", "270°", "360°"], 1, "Opposite angles in a cyclic quadrilateral are supplementary."],
            ["A radius is drawn to the point where a tangent touches the circle. The angle is:", ["30°", "45°", "90°", "180°"], 2, "Radius and tangent are perpendicular at contact."],
            ["The sum of the interior angles of a triangle is:", ["90°", "180°", "270°", "360°"], 1, "The three interior angles total 180°."],
            ["If a cyclic quadrilateral has an angle of 110°, its opposite angle is:", ["70°", "90°", "110°", "250°"], 0, "180° - 110° = 70°."],
            ["An angle subtended by a diameter at the circumference is:", ["45°", "60°", "90°", "180°"], 2, "The angle in a semicircle is 90°."],
            ["If two parallel lines are cut by a transversal, corresponding angles are:", ["Equal", "Supplementary always", "Always 90°", "Unequal always"], 0, "Corresponding angles are equal when the lines are parallel."],
            ["The exterior angle of a triangle equals:", ["The sum of two opposite interior angles", "The smallest angle only", "90° always", "360°"], 0, "An exterior angle equals the sum of the two opposite interior angles."]
        ]
    }
};

let currentQuestionIndex = 0;
let currentQuestionSet = [];
let currentQuestionData = null;
let answerChecked = false;
let score = 0;

function showPracticeQuestion() {
    currentQuestionData = currentQuestionSet[currentQuestionIndex];
    answerChecked = false;

    let optionsHTML = "";

    currentQuestionData[1].forEach(function(option, index) {
        optionsHTML += `
            <label class="practice-option">
                <input type="radio" name="mathAnswer" value="${index}">
                ${option}
            </label>
        `;
    });

    practiceQuestion.innerHTML = `
        <h3>Question ${currentQuestionIndex + 1} of ${currentQuestionSet.length}</h3>
        <p>${currentQuestionData[0]}</p>
        <div>${optionsHTML}</div>
        <button type="button" id="checkMathAnswer">Check Answer</button>
        <p id="mathFeedback" aria-live="polite"></p>
        <button type="button" id="nextMathQuestion" hidden>
            Next Question
        </button>
    `;

    document.getElementById("checkMathAnswer")
        .addEventListener("click", function() {
            const selected = document.querySelector(
                'input[name="mathAnswer"]:checked'
            );
            const feedback = document.getElementById("mathFeedback");

            if (!selected) {
                feedback.textContent = "Please choose an answer first.";
                feedback.style.color = "#721c24";
                return;
            }

            if (answerChecked) {
                return;
            }

            answerChecked = true;

           if (Number(selected.value) === currentQuestionData[2]) {
    score++;

    feedback.textContent =
        "Correct! Your score is " + score + ". " +
        currentQuestionData[3];

    feedback.style.color = "#155724";
} else {
    feedback.textContent =
        "Not quite. Your score is " + score + ". " +
        currentQuestionData[3];

    feedback.style.color = "#721c24";
}

            document.querySelectorAll('input[name="mathAnswer"]')
                .forEach(function(input) {
                    input.disabled = true;
                });

            document.getElementById("nextMathQuestion").hidden = false;

            if (currentQuestionIndex === currentQuestionSet.length - 1) {
                document.getElementById("nextMathQuestion").textContent =
                    "Restart Questions";
            }
        });

    document.getElementById("nextMathQuestion")
        .addEventListener("click", function() {
            currentQuestionIndex++;

            if (currentQuestionIndex >= currentQuestionSet.length) {
                currentQuestionIndex = 0;
            }

            showPracticeQuestion();
        });
}

if (startPractice && practiceQuestion) {
    startPractice.addEventListener("click", function() {
        const grade = practiceGrade.value;
        const topic = practiceTopic.value;

        currentQuestionSet = mathsQuestions[grade][topic];
        currentQuestionIndex = 0;
        score= 0;

        showPracticeQuestion();
    });
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const userMessage = document.getElementById("contactMessage").value.trim();
        const feedback = document.getElementById("contactFormMessage");

        // Validate all fields
        if (!name || !email || !subject || !userMessage) {
            feedback.textContent = "Please complete all four fields.";
            feedback.style.color = "red";
            return;
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            feedback.textContent = "Please enter a valid email address.";
            feedback.style.color = "red";
            return;
        }

        // Prepare an email for the visitor to send
        const recipient = "info@tsmmathsclub.co.za";
        const emailSubject = encodeURIComponent(subject);
        const emailBody = encodeURIComponent(
            "Name: " + name +
            "\nEmail: " + email +
            "\n\nMessage:\n" + userMessage
        );

        feedback.textContent = "Your email is ready. Your email application will open so you can review and send it.";
        feedback.style.color = "#123A5C";

        window.location.href =
            "mailto:" + recipient +
            "?subject=" + emailSubject +
            "&body=" + emailBody;
    });
}

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function(button) {
    button.addEventListener("click", function() {
        const answer = button.nextElementSibling;

        const isOpen = button.getAttribute("aria-expanded") === "true";

        answer.hidden =isOpen;
        button.setAttribute("aria-expanded", String(!isOpen));
        const icon = button.querySelector(".faq-icon");

        if (icon) {
            icon.textContent = isOpen ? "+" : "-";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const enrolmentForm = document.getElementById("studentEnrolmentForm");

    if (!enrolmentForm) {
        return;
    }

    const packageOptions = document.querySelectorAll('input[name="package"]');
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');

    const packageAmount = document.getElementById("packageAmount");
    const cardAmount = document.getElementById("cardAmount");

    const bankPanel = document.getElementById("bankPaymentDetails");
    const cardPanel = document.getElementById("cardPaymentDetails");

    const enrolMessage = document.getElementById("enrolMessage");

    const firstName = document.getElementById("studentFirstName");
    const lastName = document.getElementById("studentLastName");
    const bankReference = document.getElementById("bankReference");

    const copyButton = document.getElementById("copyBankDetails");
    const bankCopyMessage = document.getElementById("bankCopyMessage");

    // Update package price
    packageOptions.forEach(function (option) {
        option.addEventListener("change", function () {
            const price = Number(option.dataset.price);

            packageAmount.textContent = "R" + price.toFixed(2);
            cardAmount.textContent = price.toFixed(2);
        });
    });

    // Display selected payment panel
    paymentOptions.forEach(function (option) {
        option.addEventListener("change", function () {
            bankPanel.hidden = option.value !== "bank";
            cardPanel.hidden = option.value !== "card";

            enrolMessage.textContent = "";
            enrolMessage.className = "enrol-message";
        });
    });

    // Update bank payment reference
    function updateReference() {
        const fullName =
            firstName.value.trim() + " " + lastName.value.trim();

        bankReference.textContent =
            fullName.trim() || "Student Full Name";
    }

    firstName.addEventListener("input", updateReference);
    lastName.addEventListener("input", updateReference);

    // Copy bank details
    copyButton.addEventListener("click", async function () {
        const bankDetails =
            "Bank: FNB\n" +
            "Account holder: TSM Math Club\n" +
            "Account number: 00000000000\n" +
            "Account type: Cheque Account\n" +
            "Branch code: 067930\n" +
            "Payment reference: " + bankReference.textContent;

        try {
            await navigator.clipboard.writeText(bankDetails);
            bankCopyMessage.textContent =
                "Banking details copied successfully.";
        } catch (error) {
            bankCopyMessage.textContent =
                "Unable to copy details. Please copy them manually.";
        }
    });

    // Submit enrolment form
    enrolmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        enrolMessage.textContent = "";
        enrolMessage.className = "enrol-message";

        const requiredFields = enrolmentForm.querySelectorAll(
            "input[required]:not([type='radio']), select[required], textarea[required]"
        );

        let isValid = true;

        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];

            if (field.value.trim() === "" || !field.checkValidity()) {
                field.classList.add("invalid-field");
                isValid = false;
            } else {
                field.classList.remove("invalid-field");
            }
        }

        const selectedPackage = document.querySelector(
            'input[name="package"]:checked'
        );

        if (!selectedPackage) {
            isValid = false;
        }

        const selectedPayment = document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

        if (!selectedPayment) {
            isValid = false;
        }

        // Check card acknowledgement
        if (selectedPayment && selectedPayment.value === "card") {
            const cardAcknowledgement =
                document.getElementById("cardAcknowledgement");

            if (!cardAcknowledgement.checked) {
                isValid = false;
            }
        }

        if (!isValid) {
            enrolMessage.textContent =
                "Please complete all required fields and selections correctly.";

            enrolMessage.className = "enrol-message error";
            return;
        }

        // Collect student information
        const packageName = selectedPackage.value;
        const packagePrice = Number(selectedPackage.dataset.price);

        const studentName =
            firstName.value.trim() + " " + lastName.value.trim();

        const guardianName =
            document.getElementById("guardianFirstName").value.trim() +
            " " +
            document.getElementById("guardianLastName").value.trim();

        const dateOfBirth =
            document.getElementById("dateOfBirth").value;

        const email =
            document.getElementById("contactEmail").value.trim();

        const phone =
            document.getElementById("contactPhone").value.trim();

        const grade =
            document.getElementById("studentGrade").value;

        const subject =
            document.getElementById("studentSubject").value;

        const paymentMethod =
            selectedPayment.value === "bank"
                ? "Bank Transfer / EFT"
                : "Card Payment";

        // Display enrolment summary
        enrolMessage.textContent =
            "Enrolment submitted successfully!\n\n" +
            "Student: " + studentName + "\n" +
            "Date of Birth: " + dateOfBirth + "\n" +
            "Parent/Guardian: " + guardianName + "\n" +
            "Email: " + email + "\n" +
            "Phone: " + phone + "\n" +
            "Grade: " + grade + "\n" +
            "Subject: " + subject + "\n" +
            "Package: " + packageName + "\n" +
            "Amount: R" + packagePrice.toFixed(2) + "\n" +
            "Payment Method: " + paymentMethod;

        enrolMessage.className = "enrol-message success";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("resourceSearch");
    const searchMessage = document.getElementById("resourceSearchMessage");
    const resourceCards = document.querySelectorAll(".resource-card");

    if (!searchInput || !searchMessage || resourceCards.length ===0) {
        return;
    }

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let resultsFound = 0;

        resourceCards.forEach(function (card) {
            const cardText = card.textContent.toLowerCase();

            if (cardText.includes(searchTerm)) {
                card.style.display = "";
                resultsFound++;
            } else {
                card.style.display ="none";
        }
    });

    if (searchTerm === "") {
        searchMessage.textContent =
        "Browse our available mathematics resources."

    } else if (resultsFound > 0) {
        searchMessage.textContent =
        resultsFound + "resource(s) found.";

    } else {
        searchMessage.textContent =
        "No resource found. Try another keyword.";
        
        }
    });
});