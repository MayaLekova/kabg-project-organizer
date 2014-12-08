var $members = $("#members")
        .text("Loading Cards...");
var $boards = $("#boards")
        .text("Loading Boards...");
var $cards = $("#cards")
        .text("Loading Cards...");
var $tasks = $("#active-tasks");
        
var gMembers = [],
    gBoards = [],
    gCards = [],
    gActiveTasks = [];

Trello.get('organizations/khanacademy3/members/', function(members) {
    $members.empty();

    $.each(members, function(ix, member) {
        gMembers[member.id] = member;
        $("<a>")
        .attr({href: 'http://trello.com/' + member.id, target: "_blank"})
        .addClass("member")
        .text(member.fullName)
        .appendTo($members);
    });
});

Trello.get('organizations/khanacademy3/boards/', function(boards) {
    $boards.empty();

    $.each(boards, function(ix, board) {
        $("<a>")
        .attr({href: 'http://trello.com/board/' + board.id, target: "_blank"})
        .addClass("member")
        .text(board.name)
        .appendTo($boards);
        gBoards[board.id] = board;
    });
    $.each(boards, function(ix, board) {
        Trello.get('boards/'+board.id+'/cards/', function(cards) {
            gCards = gCards.concat(cards);
        })
    })
});

setTimeout(function() {
    $cards.empty();
    $.each(gCards, function(ix, card) {
        var row = $("<tr>");
        $("<td>").text(gBoards[card.idBoard].name).appendTo(row);

        var link = $("<a>")
        .attr({href: 'http://trello.com/c/' + card.id, target: "_blank"})
        .addClass("member")
        .text(card.name);

        var linkCell = $("<td>").html("<a href='http://trello.com/c/" + card.id+"' target='_blank'>"+card.id+"</a>")
        .appendTo(row);
        
        $("<td class='card-name'>").text(card.name).appendTo(row);
        
        var asignee = card.idMembers.length > 0 ? gMembers[card.idMembers[0]].fullName : "no one";
        $("<td>").text(asignee).appendTo(row);
        
        var dueDate = card.due ? new Date(card.due).toDateString() : "no date";
        $("<td>").text(dueDate).appendTo(row);
        
        row.appendTo($tasks);
        
        //link.appendTo($cards);
    });
}, 2000);