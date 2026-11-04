# 筆順寫字本產生器

貼上文章或生字，自動排成有筆順提示的 A4 寫字本，可列印，也可下載 Word、PPT、PDF。
工具有兩個版本可以切換：

- 數字筆順：大字標出筆順數字、筆畫路徑與方向箭頭，旁邊一筆一筆分解，下方接描寫格。
- 教育部筆順圖：教育部筆順提示原圖加上練習格。

兩個版本都可以選橫式或直式排版。

下載的 Word、PPT 會使用電腦裡的「標楷體」；若要讓預覽和下載檔案字體一致，請在工具中選「標楷體（電腦內建）」。

## 放上 GitHub Pages
1. 把整個資料夾上傳到一個 GitHub repository（index.html、maker.html、stroke-common.js、radicals.js、strokes、strokedata 都要）。
2. 到 repository 的 Settings → Pages，Source 選 main 分支的根目錄，儲存。
3. 幾分鐘後即可用 https://<帳號>.github.io/<repository 名稱>/ 開啟。

直接在電腦上雙擊 index.html 也能預覽和列印；下載 Word、PPT、PDF 需要放到網站上使用。

## 數字筆順與「筆順製作」
數字筆順內建 946 個字，都已和教育部筆順提示逐字比對。
其他字可以打開 maker.html（筆順製作），對照教育部提示圖，依正確順序點選筆畫後加入寫字本；
目前約有 4,100 個字有開源筆畫資料可以製作。
製作好的字會先存在該台電腦的瀏覽器；按「下載 custom.js」取代 strokedata/custom.js，
上傳到網站後，所有人都能使用。

## 資料來源與授權
- strokes 資料夾：中華民國教育部《國字標準字體筆順學習網》「全字筆順提示」
  （https://stroke-order.learningweb.moe.edu.tw），依「創用CC 姓名標示－非商業性－禁止改作」授權，
  以原圖未經修改方式使用，並於每頁標示出處。請勿用於商業用途，也請勿修改圖檔內容。
- strokedata 資料夾：開源專案 animCJK 的繁體中文筆畫資料（經 hanzi-writer-data-acjk 整理），以及 Make Me a Hanzi 筆畫資料（strokedata/src 內供製作使用），
  皆依 Arphic Public License 使用，授權全文見 strokedata/ARPHICPL.TXT。
- radicals.js：部首、總筆畫數、部首外筆畫，取自中華民國教育部《國語小字典》（dict_mini_2019_20260929），
  小字典未收的字取自《重編國語辭典修訂本》（dict_revised_2015_20260929），
  資料來源為教育部國語辭典公眾授權網（https://language.moe.gov.tw/001/Upload/Files/site_content/M0001/respub/index.html），
  依「創用CC 姓名標示－禁止改作 3.0 臺灣」授權，只取上述欄位、內容未修改。
  兩部辭典重疊的字，部首與筆畫完全一致。括號內的部首寫法（例如「艸（艹）」）是寫字本另外加上的提示，不是辭典內容。

## 部首
設定區的「部首」開關打開時，每個字會標出部首與部首外筆畫，例如「部首 禾　部首外 4 畫」；
部首在字裡有常見的其他寫法時，會一起列出，例如「艸（艹）」「水（氵）」「手（扌）」。
列印、Word、PPT、PDF 都會包含部首，頁尾也會加上部首資料的出處。
