function getStudentList() {
  //スプレッドシートの情報を取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet1 = ss.getSheetByName("下書き");
  const sheet2 = ss.getSheetByName("名簿");

  //所属しているクラスの一覧を配列で取得
  var myCourses = Classroom.Courses.list().courses;
  
  //スプレッドシート「名簿」からクラス名を取得
  const classname = sheet2.getRange("A1").getValue();

  ////取得したいクラスのIDを、クラス名から取得
  var targetClassName = classname; //各々取得したいクラス名を入力
  for (i = 0; i < myCourses.length; i++) {
    if (myCourses[i]['name'] === targetClassName) { //targetClassNameに一致するときのみ以下の処理を実施
      var myClassId = myCourses[i]['id'];
    } else {
      continue;
    }
  }

  // 取得したクラスIDから、そのクラスに所属している生徒リストを取得
  var students = Classroom.Courses.Students.list(myClassId);

  //残っている下書きを削除
  var clear_range = sheet1.getRange("A3:B32");
  clear_range.clearContent();

  //　生徒一覧をスプレッドシートに出力
  for (i = 0; i < students['students'].length; i++){
    var student = students['students'][i];
    j = i+3;
    sheet1.getRange("A" + j).setValue(student['profile']['name']['fullName']);//生徒の名前を出力
    sheet1.getRange("B" + j).setValue(student['profile']['emailAddress']); //生徒のアドレス出力
  }

  //名簿に貼り付けてソート
  var values = sheet1.getRange('D3:G32').getValues();
  var set_range = sheet2.getRange('A3:D32');
  set_range.setValues(values);
  set_range.sort({column:1,ascending:true});
}
