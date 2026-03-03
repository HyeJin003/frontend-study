import PortOne from "@portone/browser-sdk/v2";

export function useCertification() {
  async function certify() {
    const result = await PortOne.requestIdentityVerification({
      // 고객사 storeId로 변경해주세요.
      storeId: "store-d9c09004-5286-49e9-9eb9-91803f556632",
      identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
      // 연동 정보 메뉴의 채널 관리 탭에서 확인 가능합니다.
      channelKey: "channel-key-59df86b1-97e2-4f16-b233-df4005c3ae63",
    });
    // 오류 발생 시
    //undefined인 경우는 사용자가 인증 창을 닫거나 취소했을때
    if (!result || result.code !== undefined) {
      alert(result?.message ?? "인증이 취소되었습니다.");
      return;
    }

    // 서버에 인증 완료 처리 요청
    await fetch("/api/certification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
    });
  }

  return { certify };
}
