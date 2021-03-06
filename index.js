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

function dateToExcelString (date) {
    return date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
};

var priorities = {
    red: 0,
    orange: 1,
    yellow: 2,
    green: 3,
    none: 1000
}

var priorityOf = function(card) {
    
    var labelNames = _.pluck(card.labels, 'color');
    if(labelNames.length == 0) {// for some reason
        return priorities[none];
    }
    
    var maxPriority = _.max(labelNames, function(name) { 
        return priorities[name]; 
        
    });
    
    return priorities[maxPriority];
}

var gatherCards = function() {
    $cards.empty();
    $.each(gCards, function(ix, card) {
        var row = $("<tr>");
        $("<td>").text(gBoards[card.idBoard].name).appendTo(row);

        var linkCell = $("<td>").html("<a href='http://trello.com/c/" + card.id + "' target='_blank'>" 
            + "http://trello.com/c/" + card.id + "</a>")
        .appendTo(row);
        
        $("<td class='card-name'>").text(card.name).appendTo(row);
        
        var priorityCell = $("<td>");
        if(card.labels.length > 0) { 
            priorityCell.text(priorityOf(card));
        } else {
            priorityCell.text(priorities.none);
        }
        priorityCell.appendTo(row);
        
        var asignee = "no one";
        if(card.idMembers.length > 0) {
            var memberNames = card.idMembers.map(function(id) {
                return gMembers[id] ? gMembers[id].fullName : undefined;
            });
            asignee = _.compact(memberNames).join(',');
        }
        $("<td>").text(asignee).appendTo(row);
        
        var dueDate = card.due ? dateToExcelString(new Date(card.due)) : "no date";
        $("<td>").text(dueDate).appendTo(row);
        
        row.appendTo($tasks);
    });
};

var gatherMembers = function() {
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
        gatherCards();
    });
};

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
    gatherCards = _.after(boards.length + 1, gatherCards);
    gatherMembers();
    
    $.each(boards, function(ix, board) {
        Trello.get('boards/'+board.id+'/cards/', function(cards) {
            gCards = gCards.concat(cards);
            gatherCards();
        });
    })
});

