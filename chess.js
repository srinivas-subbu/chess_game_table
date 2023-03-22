$(".chess_board").ready(function(){
    var board = $(".chess_board");
    for(var i=0; i<64; ++i){
      var bg = (i%2) ? true : false;
      if(parseInt(i/8)%2) bg = !bg;
      var html = '<div class="chess_cell bg'+(bg ? 1 : 0)+'" data-x="'+(i%8)+'" data-y="'+parseInt(i/8)+'"></div>';
      $(board).append(html);
    }
  })
  
  $(document).ready(function(){
  
    var cell_width = 56.25;
    var cell_height = 56.25;
    var chess_board = $(".chess_board")[0];
    var chaess_cell = $('.chess_cell');
    var chess_figures = [
      {"name":"bR","data":"black","id":"blackRook","position":{"x":0,"y":0}},
      {"name":"bN","data":"black","id":"blackKnight","position":{"x":1,"y":0}},
      {"name":"bB","data":"black","id":"blackBishop","position":{"x":2,"y":0}},
      {"name":"bQ","data":"black","id":"blackQueen","position":{"x":3,"y":0}},
      {"name":"bK","data":"black","id":"blackKing","position":{"x":4,"y":0}},
      {"name":"bB","data":"black","id":"blackBishop1","position":{"x":5,"y":0}},
      {"name":"bN","data":"black","id":"blackKnight1","position":{"x":6,"y":0}},
      {"name":"bR","data":"black","id":"blackRook1","position":{"x":7,"y":0}},
      {"name":"bP","data":"black","id":"blackPawn","position":{"x":0,"y":1}},
      {"name":"bP","data":"black","id":"blackPawn1","position":{"x":1,"y":1}},
      {"name":"bP","data":"black","id":"blackPawn2","position":{"x":2,"y":1}},
      {"name":"bP","data":"black","id":"blackPawn3","position":{"x":3,"y":1}},
      {"name":"bP","data":"black","id":"blackPawn4","position":{"x":4,"y":1}},
      {"name":"bP","data":"black","id":"blackPawn5","position":{"x":5,"y":1}},
      {"name":"bP","data":"black","id":"blackPawn6","position":{"x":6,"y":1}},
      {"name":"bP","data":"black","id":"blackPawn7","position":{"x":7,"y":1}},
      {"name":"wR","data":"white","id":"whiteRook","position":{"x":0,"y":7}},
      {"name":"wN","data":"white","id":"whiteKnight","position":{"x":1,"y":7}},
      {"name":"wB","data":"white","id":"whiteBishop","position":{"x":2,"y":7}},
      {"name":"wQ","data":"white","id":"whiteQueen","position":{"x":3,"y":7}},
      {"name":"wK","data":"white","id":"whiteKing","position":{"x":4,"y":7}},
      {"name":"wB","data":"white","id":"whiteBishop1","position":{"x":5,"y":7}},
      {"name":"wN","data":"white","id":"whiteKnight1","position":{"x":6,"y":7}},
      {"name":"wR","data":"white","id":"whitePawn","position":{"x":7,"y":7}},
      {"name":"wP","data":"white","id":"whitePawn1","position":{"x":0,"y":6}},
      {"name":"wP","data":"white","id":"whitePawn2","position":{"x":1,"y":6}},
      {"name":"wP","data":"white","id":"whitePawn3","position":{"x":2,"y":6}},
      {"name":"wP","data":"white","id":"whitePawn4","position":{"x":3,"y":6}},
      {"name":"wP","data":"white","id":"whitePawn5","position":{"x":4,"y":6}},
      {"name":"wP","data":"white","id":"whitePawn6","position":{"x":5,"y":6}},
      {"name":"wP","data":"white","id":"whitePawn7","position":{"x":6,"y":6}},
      {"name":"wP","data":"white","id":"whitePawn8","position":{"x":7,"y":6}}
    ];
    for(var i=0; i<chess_figures.length; ++i){
      var figureHTML = '<div class="chess_figure" name="'+chess_figures[i].name+'" style="left:'+cell_width*chess_figures[i].position.x+'px;top:'+cell_height*chess_figures[i].position.y+'px" data-figureId="'+chess_figures[i].id+'" data-color="'+chess_figures[i].data+'"></div>';
      chess_figures[i].figureHTML = $(figureHTML);
      $(chess_board).append($(chess_figures[i].figureHTML));
    };
  
    $(function() {
  
      $('.chess_figure').draggable({
        containment: "parent",
        zIndex: 1,
        snap: ".chess_cell",
        revert: function() {
          if ($(this).hasClass('drag-revert')) {
            $(this).removeClass('drag-revert');
            return true;
          }
        }
      });
  
      $('.chess_cell').droppable({
        accept: ".chess_figure",
        tolerance: 'intersect',
        over: function () {
          $(this).css({
            backgroundColor: "green"
          });
        },
        out: function () {
          $(this).css("background-color", "")
        },
        drop: function (event, ui) {
          //check for valid move
          //if invalid move - dont move
          var figure = getFigure($(ui.draggable).attr('data-figureId'));
          figure.position.newX = $(this).attr('data-x');
          figure.position.newY = $(this).attr('data-y');
          if (checkValidMove(figure)) {
            $(this).css({
              backgroundColor: "",
            });
            return $(ui.draggable).addClass('drag-revert');
          }else{
            figure.position.x = parseInt(figure.position.newX);
            figure.position.y = parseInt(figure.position.newY);
          }
          //overrite figure position in chess_figures
          $(this).append(ui.draggable.css('position','static'));
          $(this).css({
            backgroundColor: "",
          });
          deleteFigure(figure);
          console.log (figure);
          if (figure.data=="black") {
            $(".chess_board .chess_figure[data-color='black']").draggable("disable");
            $(".chess_board .chess_figure[data-color='white']").draggable("enable");
          } else {
            $(".chess_board .chess_figure[data-color='white']").draggable("disable");
            $(".chess_board .chess_figure[data-color='black']").draggable("enable");
          }
          handleCheckW();
          handleCheckB();
        },
      });
    });
  
    function checkValidMove(figure){
      var invalid = false;
  //cheeck other figure in the cell
  var figureInCell = getFigureInCell(figure.position.newX, figure.position.newY);
      invalid = invalid || (figureInCell && figure.id!=figureInCell.id && figure.data==figureInCell.data);
  //check figure can move
      invalid = (invalid || figureCanNotMove(figure, figure.position.newX, figure.position.newY));
      return invalid;
    }
  
    function deleteFigure(figure) {
      for (var i=0; i<chess_figures.length; ++i) {
        if(chess_figures[i].isKilled) continue;
        if(figure.position.newX==chess_figures[i].position.x && figure.position.newY==chess_figures[i].position.y && figure.data!=chess_figures[i].data) {
  
          $(".chess_board .chess_figure[data-figureId='"+chess_figures[i].id+"']")[0].remove();
          chess_figures[i].isKilled = true;
        }
      }
    }
  
    function getFigure(id){
      for(var i=0; i<chess_figures.length; ++i){
        if(chess_figures[i].id==id){
          return chess_figures[i];
        };
      };
      return;
    }
  
    function getFigureInCell(x,y){
      var figure;
      for(var i=0; i<chess_figures.length; ++i){
        if(x==chess_figures[i].position.x && y==chess_figures[i].position.y){
          figure = chess_figures[i];
        };
      };
      return figure;
    }
  
  function handleCheckW(king = 'whiteKing') {
    var king = getFigure(king);
    var kingCanMove = false;
    var isCheck = false;
    var kingMoves = [true, true, true, true, true, true, true, true, true];
    for (var ii = 0; ii < chess_figures.length; ++ii) {
        var figure = chess_figures[ii];
  
        if (figure.isKilled) continue;
        if (figure.data!=king.data && !figureCanNotMove(figure, king.position.x, king.position.y)){
          isCheck = true;
        }
  
        if (figure.data!=king.data && isCheck) {
         for(var i=king.position.x-1; i<=king.position.x+1;++i){
            for(var j=king.position.y-1; j<=king.position.y+1;++j){
  
              if(i<0 || i>7 || j<0 || j>7 || (i==king.position.x && j==king.position.y)){
                 kingMoves[(i-(king.position.x-1))*3+(j-(king.position.y-1))] = false;
                 continue;
               }
              if(!figureCanNotMove(figure, i, j) || getFigureInCell(i,j)){
                kingMoves[(i-(king.position.x-1))*3+(j-(king.position.y-1))] = false;
              }
            }
          }
        }
      }
      kingCanMove = kingMoves.indexOf(true)>=0;
      if(isCheck){
        console.log("Check",figure,king);
  
      }
      if(isCheck && !kingCanMove){
        console.log("MATE",figure,king);
        $('.chess_figure').draggable('disable');
        PopUpShow();
      }
    }
  
    function handleCheckB(king = 'blackKing') {
    var king = getFigure(king);
    var kingCanMove = false;
    var isCheck = false;
    var kingMoves = [true, true, true, true, true, true, true, true, true];
    for (var ii = 0; ii < chess_figures.length; ++ii) {
        var figure = chess_figures[ii];
  
        if (figure.isKilled) continue;
        if (figure.data!=king.data && !figureCanNotMove(figure, king.position.x, king.position.y)){
          isCheck = true;
        }
  
        if (figure.data!=king.data && isCheck) {
         for(var i=king.position.x-1; i<=king.position.x+1;++i){
            for(var j=king.position.y-1; j<=king.position.y+1;++j){
  
              if(i<0 || i>7 || j<0 || j>7 || (i==king.position.x && j==king.position.y)){
                 kingMoves[(i-(king.position.x-1))*3+(j-(king.position.y-1))] = false;
                 continue;
               }
              if(!figureCanNotMove(figure, i, j) || getFigureInCell(i,j)){
                kingMoves[(i-(king.position.x-1))*3+(j-(king.position.y-1))] = false;
              }
            }
          }
        }
      }
      kingCanMove = kingMoves.indexOf(true)>=0;
      if(isCheck){
        console.log("Check",figure,king);
  
      }
      if(isCheck && !kingCanMove){
        console.log("MATE",figure,king);
        $('.chess_figure').draggable('disable');
        PopUpShow();
      }
    }
  
    function figureCanNotMove(figure, newX, newY){
      var invalid = false;
  
      //check figures on path
      for(var j=0; j<chess_figures.length; ++j){
        if(chess_figures[j].id == figure.id){
           continue;
        }
        var startX = Math.min(figure.position.x, newX);
        var endX = Math.max(figure.position.x, newX);
        var startY = Math.min(figure.position.y, newY);
        var endY = Math.max(figure.position.y, newY);
  
        switch (figure.name) {
  
          case "wB":
          case "bB":
          case "wQ":
          case "bQ":
          case "wR":
          case "bR":
          {
            if(((newY == figure.position.y && newY == chess_figures[j].position.y) && (chess_figures[j].position.x>startX && chess_figures[j].position.x<endX)) ||
               ((newX == figure.position.x && newX == chess_figures[j].position.x) && (chess_figures[j].position.y>startY && chess_figures[j].position.y<endY)) ||
  
               ((Math.abs(figure.position.x - chess_figures[j].position.x) == Math.abs(figure.position.y - chess_figures[j].position.y)) &&
               (chess_figures[j].position.y>startY && chess_figures[j].position.y<endY) && (chess_figures[j].position.x>startX && chess_figures[j].position.x<endX)) ||
  
               ((Math.abs(figure.position.x - chess_figures[j].position.x) == Math.abs(figure.position.y - chess_figures[j].position.y)) &&
               (chess_figures[j].position.x>startX && chess_figures[j].position.x<endX) && (chess_figures[j].position.y>startY && chess_figures[j].position.y<endY))
              ){
                invalid = true;
              }
            break;
          }
        }
      }
  
      switch(figure.name){
        case "wP":
        {
          if(!((newY == figure.position.y-1 && newX == figure.position.x) ||
               (newY == 4 && newX == figure.position.x)
  
            )){
            invalid = true;
          }
          for(var k=0; k<chess_figures.length; ++k){
            if(newY == figure.position.y-1 && (newX == figure.position.x-1 || newX == figure.position.x+1) &&
            (newY == chess_figures[k].position.y && newX == chess_figures[k].position.x)){
              invalid = false;
              break;
            }
          }
          break;
        }
        case "bP":
        {
          if(!((newY == figure.position.y+1 && newX == figure.position.x) ||
               (newY == 3 && newX == figure.position.x)
            )){
            invalid = true;
          }
          for(var k=0; k<chess_figures.length; ++k){
            if(newY == figure.position.y+1 && (newX == figure.position.x-1 || newX == figure.position.x+1) &&
            (newY == chess_figures[k].position.y && newX == chess_figures[k].position.x)){
              invalid = false;
              break;
            }
          }
          break;
        }
        case "wK":
        case "bK":
        {
          if(!((newY == figure.position.y-1 && newX == figure.position.x) ||
               (newY == figure.position.y+1 && newX == figure.position.x) ||
               (newX == figure.position.x-1 && newY == figure.position.y) ||
               (newX == figure.position.x+1 && newY == figure.position.y) ||
               (newY == figure.position.y-1 && newX == figure.position.x-1) ||
               (newY == figure.position.y+1 && newX == figure.position.x-1) ||
               (newX == figure.position.x+1 && newY == figure.position.y-1) ||
               (newX == figure.position.x-1 && newY == figure.position.y-1) ||
               (newY == figure.position.y-1 && newX == figure.position.x+1) ||
               (newY == figure.position.y+1 && newX == figure.position.x+1)
             )){
               invalid = true;
              }
              break;
        }
        case "wN":
        case "bN":
        {
          if(!((newY == figure.position.y+1 && newX == figure.position.x-2) ||
               (newY == figure.position.y-1 && newX == figure.position.x-2) ||
               (newY == figure.position.y-2 && newX == figure.position.x-1) ||
               (newY == figure.position.y-2 && newX == figure.position.x+1) ||
               (newY == figure.position.y-1 && newX == figure.position.x+2) ||
               (newY == figure.position.y+1 && newX == figure.position.x+2) ||
               (newY == figure.position.y+2 && newX == figure.position.x-1) ||
               (newY == figure.position.y+2 && newX == figure.position.x+1)
              )){
            invalid = true;
          }
          break;
        }
        case "wR":
        case "bR":
        {
          if(!(((newY == figure.position.y<=7 && newY == figure.position.y>=0) || newX == figure.position.x) ||
               ((newX == figure.position.x<=7 && newX == figure.position.x>=0) || newY == figure.position.y)
          )){
            invalid = true;
          }
          break;
        }
        case "wB":
        case "bB":
        {
          if(!(Math.abs(figure.position.x - newX) == Math.abs(figure.position.y - newY))){
            invalid = true;
          }
          break;
        }
        case "wQ":
        case "bQ":
        {
          if(!(((newY == figure.position.y<=7 && newY == figure.position.y>=0) || newX == figure.position.x) ||
               ((newX == figure.position.x<=7 && newX == figure.position.x>=0) || newY == figure.position.y) ||
               (Math.abs(figure.position.x - newX) == Math.abs(figure.position.y - newY)
            ))){
            invalid = true;
          }
          break;
        }
      }
      return invalid;
    }
  
  });