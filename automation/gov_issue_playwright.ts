import { chromium } from "playwright";

async function waitForEnter(): Promise<void> {
  process.stdin.resume();
  return new Promise((resolve) => {
    process.stdin.once("data", () => resolve());
  });
}

async function main() {
  const [, , pnu, address, jibun] = process.argv;

  if (!pnu || !address || !jibun) {
    console.error("사용법: npm run issue -- <pnu> <address> <jibun>");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(
    "https://www.gov.kr/mw/AA020InfoCappView.do?HighCtgCD=A03005&CappBizCD=SG4CADM2015&tp_seq=01",
    { waitUntil: "domcontentloaded" }
  );

  console.log("======================================");
  console.log(`대상 PNU: ${pnu}`);
  console.log(`주소: ${address}`);
  console.log(`지번: ${jibun}`);
  console.log("정부24 로그인/인증을 직접 완료한 뒤 Enter를 누르세요.");
  console.log("======================================");

  await waitForEnter();

  try {
    // 실제 페이지 구조에 맞게 수정 필요
    const bodyText = await page.locator("body").innerText();

    console.log("현재 페이지 일부 텍스트 확인:");
    console.log(bodyText.slice(0, 500));

    // 아래 selector는 예시다.
    // 정부24 페이지 구조가 다르면 개발자도구로 selector를 다시 잡아야 한다.
    const possibleAddressSelectors = [
      'input[name="address"]',
      'input[id*="address"]',
      'input[placeholder*="주소"]'
    ];

    const possibleJibunSelectors = [
      'input[name="jibun"]',
      'input[id*="jibun"]',
      'input[placeholder*="지번"]'
    ];

    let addressFilled = false;
    for (const selector of possibleAddressSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        await page.locator(selector).first().fill(address);
        addressFilled = true;
        console.log(`주소 입력 성공 selector: ${selector}`);
        break;
      }
    }

    let jibunFilled = false;
    for (const selector of possibleJibunSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        await page.locator(selector).first().fill(jibun);
        jibunFilled = true;
        console.log(`지번 입력 성공 selector: ${selector}`);
        break;
      }
    }

    if (!addressFilled) {
      console.log("주소 입력 selector를 찾지 못했다. 직접 페이지 구조 확인이 필요하다.");
    }

    if (!jibunFilled) {
      console.log("지번 입력 selector를 찾지 못했다. 직접 페이지 구조 확인이 필요하다.");
    }

    const possibleButtons = [
      'button:has-text("신청")',
      'button:has-text("발급")',
      'button:has-text("다음")',
      'a:has-text("신청")'
    ];

    let clicked = false;
    for (const selector of possibleButtons) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        await page.locator(selector).first().click();
        clicked = true;
        console.log(`버튼 클릭 성공 selector: ${selector}`);
        break;
      }
    }

    if (!clicked) {
      console.log("신청 버튼 selector를 찾지 못했다. 직접 확인이 필요하다.");
    }

    console.log("자동 입력 시도 완료. 결과는 열린 브라우저에서 직접 확인해라.");
  } catch (error) {
    console.error("자동화 중 오류 발생:", error);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
