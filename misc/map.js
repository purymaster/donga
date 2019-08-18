$(function(){
	var table = $("table.list");

	table.find("tr:gt(0)").hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	}).each(function(e){
		$("td:eq(0)",this).text(e+1);
		if($("td:eq(1)",this).text() != ""){
			$(this).addClass("part");
		};
	}).find("td").each(function(){
		if($(this).text() == ""){
			$(this).addClass("nodata");
		};
	});

	$(".process dd").text(Math.ceil(table.find("em.end").length / table.find("tbody").children("tr").length * 100) + "%");
});