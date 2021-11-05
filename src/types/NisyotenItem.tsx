
export interface NisyotenItem {
  gyosyuInsyoku: string;
  gyosyuSyukuhaku: string;
  shisetsuName: string,
  shisetsuNameKana: string,
  shisetsuPostCode: string,
  shisetsuAddress1: string,
  shisetsuAddress2: string,
  ninsyoDate: string,
  city: string,
  locationlat: number,
  locationlng: number,  
}

export function mapArrayToNisyotenItem(data: string[][]): NisyotenItem[] {

  var retList = Array<NisyotenItem>();
  // 先頭と末尾は除外
  for (var i = 1; i < data.length - 1; i++) {
    var value : NisyotenItem = {
      gyosyuInsyoku: data[i][0].replaceAll('"',""),
      gyosyuSyukuhaku: data[i][1].replaceAll('"',""),
      shisetsuName: data[i][2].replaceAll('"',""),
      shisetsuNameKana: data[i][3].replaceAll('"',""),
      shisetsuPostCode: data[i][4].replaceAll('"',""),
      shisetsuAddress1: data[i][5].replaceAll('"',""),
      shisetsuAddress2: data[i][6].replaceAll('"',""),
      ninsyoDate: data[i][7].replaceAll('"',""),
      city: data[i][8].replaceAll('"',""),
      locationlat: 0,
      locationlng: 0,
    }
    retList.push(value);
  }

  return retList;
}
