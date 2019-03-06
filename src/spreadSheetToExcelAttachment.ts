function createSampleDraft(
  attachmentFiles: GoogleAppsScript.Base.Blob[]
): GoogleAppsScript.Gmail.GmailDraft {
  // メール下書き作成
  let mailto = 'test@gmail.com';
  let subject = '添付テスト';
  let body = 'コメント';
  return GmailApp.createDraft(mailto, subject, body, { attachments: attachmentFiles });
}

export function testSpreadSheetToExcelAttachment(): void {
  createSampleDraft(spreadSheetToExcelAttachment('1PWGXG-LfauUqVFjptraOhyMcUtgyOWnGGxRCAtcha8k'));
}

export function spreadSheetToExcelAttachment(
  spreadSheetFileId: string
): GoogleAppsScript.Base.Blob[] {
  let targetFileId = spreadSheetFileId;
  // オプション設定
  let fetchOpt = {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  };

  try {
    // 添付するExcelファイルの名前
    let fileName = DriveApp.getFileById(targetFileId).getName() + '.xlsx';
    let fetchUrl = `https://docs.google.com/feeds/download/spreadsheets/Export?key=${targetFileId}&amp;exportFormat=xlsx`;
    return [
      UrlFetchApp.fetch(fetchUrl, fetchOpt)
        .getBlob()
        .setName(fileName)
    ];
  } catch (e) {
    Logger.log('エラー : ' + e.message);
  }
}
