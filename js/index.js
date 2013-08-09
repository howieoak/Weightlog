var db, data;

(function () {
	var $weight_list;
	//alert("inside ready page");
	
	var $list_page = $('#list_page');
	
	if (!$list_page.data.initialized) {
		$list_page.live('pagecreate', listPageCreate);
		$list_page.live('pageinit', listPageInit);
		$list_page.data.initialized = true;
	}
	
	function listPageCreate() {
		//alert("inside listPageCreate");
		createDb();
	}
	
	function listPageInit() {
		//alert("inside listPageInit");
		$weight_list = $('#weight_list');
		$btnDeleteDb = $('#delete-db');
		$btnDeleteDb.click(onDeleteDbBtnClick);
		//refreshEntries();
		displayEntries();
		
		$('#newweight_form').submit(saveNewWeight);
		$('#settings_form').submit(saveSettings);
		loadSettings();
	}
	
	function createDb()
	{
		var shortName = 'WeightLog';
		var version = '1.0';
		var displayName = 'WeightLog';
		var maxSize = 65536;
		db = openDatabase(shortName, version, displayName, maxSize);
		db.transaction(
			function(transaction) {
				transaction.executeSql(
				'CREATE TABLE IF NOT EXISTS entries ' +
				' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
				' date TEXT NOT NULL, weight INTEGER NOT NULL, ' +
				' comment TEXT);'
				);
			}
		);	
	}
	
	function removeTableEntries()
	{
		//alert("inside remove table");
		
		db.transaction(
			function(transaction) {
				transaction.executeSql('DELETE FROM entries;',
					[], deleteSuccess, errorHandler);
			}
		);
		//db.transaction(
//			function(transaction) {
//				transaction.executeSql(
//				'DROP TABLE entries;'
//				);
//			}
//		);
	}
	
	function onDeleteDbBtnClick(e) {
        e.preventDefault();
		
		if (confirm("Dette vi fjere alle registrerte oppførnger. Er du sikker?")) {
			removeTableEntries();	
		}
	}
	
	function deleteSuccess() {
		$weight_list.empty();
	}
	
	function saveNewWeight() {
		//alert("inside saveNewWeight");
		insertDb();
		goToListPageHandler();
		return false;
	}
	
	function insertDb()
	{
		var date = new Date();
		var day =  date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var displayDate = day + '/' + month + '/' + year;
		var weight = $('#weight').val();
		var comment = $('#comment').val();
		db.transaction(
			function(transaction) {
				transaction.executeSql(
					'INSERT INTO entries (date, weight, comment) VALUES (?, ?, ?);',
					[displayDate, weight, comment],
					null,
					errorHandler
				);
			}
		);
	}
	
	function insertSuccess() {
		//alert("inside insert suksess");
		//displayEntries();
		//$weight_list.listview();
		//$.mobile.changePage($list_page);
		//$.mobile.changePage($("#list_page"));
		
	}
	
	function loadWeight() {
		$('#weight').val(localStorage.weight);		
		$('#comment').val(localStorage.comment);
	}
	
	function goToListPageHandler() {
		$.mobile.changePage($("#list_page"), {
			transition: "slide",
		//	reverse: true
		});
	}
	
	
	function errorHandler(transaction, error) {
		alert('Oops. Error was '+error.message+' (Code '+error.code+')');
		return true;
	}
	
	function saveSettings() {
		//alert("inside saveSettings");
		localStorage.name = $('#settings_name').val();
		localStorage.address = $('#settings_address').val();
		
		goToListPageHandler();
		return false;
		
	}
	
	function loadSettings() {
		$('#settings_name').val(localStorage.name);		
		$('#settings_address').val(localStorage.address);
		
	}
	
	function showDetails(index) {			
		$("#details_page h1").html(data.slots[index].time);
		var html = ""
		for (var i=0; i<data.sessions.length; i++) {
			if (data.sessions[i].timeId==data.slots[index].id) {
				// We create one collapsible component per session
				html += "<div data-role='collapsible'>";
				html += "<h3>" + data.sessions[i].title + "</h3>";
				html +=" <h3>" + data.sessions[i].room + "</h3>";
				html += "<h4>Speaker/s: " + data.sessions[i].speaker;
				html += "</h4>";
				html += "<p>" + data.sessions[i].description + "</p>";	
				html += "</div>";
			}
		}
		
		// We provide the information to the details page
		$("#vektInfo").html(html);
		$("#vektInfo div").collapsible();
	
		// We change to the details page
		$.mobile.changePage($("#details_page"));
	}
	
	function displayEntries() {
		//alert("inside displayentries");
		db.transaction(
			function(transaction) {
				transaction.executeSql(
					'SELECT * FROM entries;', [], 
					function (transaction, result) {
						for (var i=0; i < result.rows.length; i++) {
							//alert("inside for");
							var row = result.rows.item(i);
							var newEntryRow = $('#entryTemplate').clone();
							newEntryRow.removeAttr('id');
							newEntryRow.removeAttr('style');
							newEntryRow.data('entryId', row.id);
							newEntryRow.find('#dato').text(row.date);
							newEntryRow.find('#vekt').text(row.weight);
							newEntryRow.find('#kommentar').text(row.comment);
							$weight_list.append(newEntryRow);
							//alert(newEntryRow.html());
						}
					},
					errorHandler
				);
			}
		);
		$weight_list.listview("refresh");
	}
	
	//$newweight_page = $('#newweight_page');
//	
//	if (!$newweight_page.data.initialized) {
//		$newweight_page.live('pagecreate', newweightPageCreate);
//		$newweight_page.live('pageinit', newweightPageInit);
//		$newweight_page.data.initialized = true;
//	}
//	
//	function newweightPageCreate() {
//		alert("inside newweightPageCreate");
//	}
//	
//	function newweightPageInit() {
//		alert("inside newweightPageInit");
//	}

	
})();