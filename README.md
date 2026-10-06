# Category Liquid Glass v1

SharePoint の `window.quickLinksData` に含まれる `category` を自動で抽出し、上部に Liquid Glass のカテゴリースイッチャーを生成します。

- カテゴリーの初出順でタブ表示
- 選択中のガラスインジケーターが横方向に「ニュルン」と移動
- 切替中だけガラスが少し潰れて伸びるモーフ表現
- リンク一覧はカテゴリーでフィルターし、フェード＋スライドで切替
- 既存の透明 Liquid Glass、SVG `feTurbulence` / `feDisplacementMap`、カーソル反射を維持
- `mode-card` も維持

現在のデータなら `選択肢 1 / 選択肢 2 / 選択肢 3` が自動的に3タブになります。SharePoint 側のカテゴリー名を変更すればUIにもそのまま反映されます。
