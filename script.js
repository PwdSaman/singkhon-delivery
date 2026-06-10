const container = document.getElementById('appContainer');
const modalTitle = document.getElementById('modalTitle');
const modalSubTitle = document.getElementById('modalSubTitle');
const modalNotice = document.getElementById('modalNotice');
const btnSubmitModal = document.getElementById('btnSubmitModal');
const loginForm = document.getElementById('loginForm');

const labelUsername = document.getElementById('labelUsername');
const inputUsername = document.getElementById('username');
const passwordGroup = document.getElementById('passwordGroup');
const inputPassword = document.getElementById('password');

const btnRequestOtp = document.getElementById('btnRequestOtp');
const otpGroup = document.getElementById('otpGroup');
const inputOtp = document.getElementById('otpCode');

function toggleMenu() {
    container.classList.toggle('menu-open');
}

function openLoginModal(mode) {

    container.classList.remove('menu-open');
    loginForm.reset();

    passwordGroup.style.display = "block";
    inputPassword.required = true;

    inputUsername.type = "text";

    btnRequestOtp.style.display = "none";

    otpGroup.style.display = "none";
    inputOtp.required = false;

    if (mode === 'customer') {

        modalTitle.innerHTML = "🛍️ เข้าสู่ระบบลูกค้า";
        modalSubTitle.innerHTML = "Singkhon Delivery Customer";

        modalNotice.innerHTML =
            '💡 กรุณาระบุหมายเลขโทรศัพท์และกด <b>"ขอ OTP"</b> เพื่อรับรหัสยืนยันตัวตน';

        labelUsername.innerHTML =
            "หมายเลขโทรศัพท์ (Phone Number)";

        inputUsername.placeholder =
            "กรอกหมายเลขโทรศัพท์ 10 หลัก";

        inputUsername.type = "tel";

        passwordGroup.style.display = "none";
        inputPassword.required = false;

        btnRequestOtp.style.display = "block";

        otpGroup.style.display = "block";
        inputOtp.required = true;

        btnSubmitModal.innerHTML =
            "📱 เข้าสู่ระบบด้วย SMS";

    } else if (mode === 'merchant') {

        modalTitle.innerHTML =
            "🏪 เข้าสู่ระบบร้านค้า";

        modalSubTitle.innerHTML =
            "Singkhon Delivery Merchant";

        modalNotice.innerHTML =
            '⚠️ สำหรับบัญชีร้านค้า <br> ต้องติดต่อให้ <b>"แอดมิน"</b> เป็นผู้สมัครให้เท่านั้น';

        labelUsername.innerHTML =
            "ชื่อผู้ใช้ (Username)";

        inputUsername.placeholder =
            "กรอกชื่อผู้ใช้ของคุณ";

        btnSubmitModal.innerHTML =
            "🔓 เข้าสู่ระบบร้านค้า";

    } else if (mode === 'rider') {

        modalTitle.innerHTML =
            "🛵 เข้าสู่ระบบไรเดอร์";

        modalSubTitle.innerHTML =
            "Singkhon Delivery Rider";

        modalNotice.innerHTML =
            '⚠️ สำหรับบัญชีไรเดอร์ <br> ต้องติดต่อให้ <b>"แอดมิน"</b> เป็นผู้สมัครให้เท่านั้น';

        labelUsername.innerHTML =
            "ชื่อผู้ใช้ (Username)";

        inputUsername.placeholder =
            "กรอกชื่อผู้ใช้ของคุณ";

        btnSubmitModal.innerHTML =
            "🔓 เข้าสู่ระบบไรเดอร์";
    }

    container.classList.add('modal-open');
}

function closeLoginModal() {
    container.classList.remove('modal-open');
}

async function requestOtp() {

    const phoneNumber = inputUsername.value;

    if (!/^0\d{9}$/.test(phoneNumber)) {
        alert("กรุณากรอกเบอร์โทรศัพท์ 10 หลัก");
        return;
    }

    try {

        const auth = window.auth;

        if (!window.recaptchaVerifier) {

            window.recaptchaVerifier =
                new window.RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    {
                        size: "normal"
                    }
                );
        }

        const thaiPhone =
            "+66" + phoneNumber.substring(1);

        window.confirmationResult =
            await window.signInWithPhoneNumber(
                auth,
                thaiPhone,
                window.recaptchaVerifier
            );

        alert("ส่ง OTP สำเร็จ");

        let countdown = 60;

        btnRequestOtp.disabled = true;

        const timer = setInterval(() => {

            countdown--;

            btnRequestOtp.innerHTML =
                `${countdown}s`;

            if (countdown <= 0) {

                clearInterval(timer);

                btnRequestOtp.disabled = false;

                btnRequestOtp.innerHTML =
                    "ขอ OTP";
            }

        }, 1000);

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

async function handleLogin(event) {

    event.preventDefault();

    const accountInfo =
        inputUsername.value;

    const isCustomerMode =
        btnSubmitModal.innerHTML.includes("SMS");

    btnSubmitModal.innerHTML =
        "⏳ กำลังตรวจสอบข้อมูล...";

    btnSubmitModal.disabled = true;

    try {

        if (isCustomerMode) {

            const otpValue =
                inputOtp.value;

            if (!window.confirmationResult) {

                alert("กรุณากดขอ OTP ก่อน");

                btnSubmitModal.disabled = false;

                btnSubmitModal.innerHTML =
                    "📱 เข้าสู่ระบบด้วย SMS";

                return;
            }

            await window.confirmationResult
                .confirm(otpValue);

            alert(
                `เข้าสู่ระบบสำเร็จ ${accountInfo}`
            );

        } else {

            alert(
                `บัญชี "${accountInfo}" ดำเนินการเข้าสู่ระบบหลังบ้าน...`
            );
        }

        btnSubmitModal.disabled = false;

        btnSubmitModal.innerHTML =
            isCustomerMode
                ? "📱 เข้าสู่ระบบด้วย SMS"
                : "🔓 เข้าสู่ระบบ";

        closeLoginModal();

    } catch (e) {

        console.error(e);

        alert("OTP ไม่ถูกต้อง");

        btnSubmitModal.disabled = false;

        btnSubmitModal.innerHTML =
            "📱 เข้าสู่ระบบด้วย SMS";
    }
}