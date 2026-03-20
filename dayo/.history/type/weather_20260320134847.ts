export type Weather = {
  name: string; //도시이름
  temp: number; //현재 기온
  feels_like: number; //체감 기온
  humidity: number; //습도
  description: string; //날씨 설명
  icon: string; //날씨 아이콘 코드
  country: string; // 나라
};
