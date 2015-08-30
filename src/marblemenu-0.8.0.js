/*!
 * @file   marblemenu.js
 * @brief  Web UI menu for mobile
 * @note   MIT License
 * @author Taria
 * @bug    how to                     : contents \n
 *          -> double scratch         :  marble of knuckle state  \n
 *          -> a few marble           :  unknown (not support) \n
 *          -> double event \n
 *             (scratch and select)   :  hide all marble \n
 *          -> scratch after selected :  keep moving a marble
 *          -> prev scratch during \n
 *             wake up effect         :  overlap marbles
 */

(function($) {
  /*** define ***/
  /* initial display style */
  var DMBL_DEVTYPE_TABLET        = "DMBL_DEVTYPE_TABLET";       //! access devices is tablet
  var DMBL_DEVTYPE_MBLAPPLE      = "DMBL_DEVTYPE_MBLIPHONE";    //! access devices is iphone
  var DMBL_DEVTYPE_MBLOTHER      = "DMBL_DEVTYPE_MBLOTHER";     //! access devices is other than iphone
  var DMBL_DEVTYPE_OTHER         = "DMBL_DEVTYPE_OTHER";        //! access devices is pc
  /* initial display style */
  var DMBL_SHOWSTYLE_FADE        = "fade";                      //! display by fade in
  var DMBL_SHOWSTYLE_SLIDE_LEFT  = "slide_left";                //! display by slide from left
  var DMBL_SHOWSTYLE_SLIDE_RIGHT = "slide_right";               //! display by slide from right
  /* turn direction */
  var DMBL_MOVEDIRECT_CLOCK      = "DMBL_MOVEDIRECT_CLOCK";     //! turn direction is clock
  var DMBL_MOVEDIRECT_ANTICLOCK  = "DMBL_MOVEDIRECT_ANTICLOCK"; //! turn direction is  anticlock
  
  /*** global ***/
  var Gmbl_devType     = Fmbl_getDevType();                     //! type of access devices (DMBL_DEVTYPE_XXX)
  var Gmbl_basePoint   = new Array( $(window).width()-40 , $(window).height()/2 ); 
                                                                //! center posint of marbles
  var Gmbl_ttRadius    = 100;                                   //! radius of turn table
  var Gmbl_runMblm     = null;                                  //! current marble menu
  /* id,class name */
  var Gmbl_classElem   = "c-mm-elem";                           //! marble element of html class
  var Gmbl_classSymb   = "c-mm-symb";                           //! marble symbol of html class
  var Gmbl_classDesc   = "c-mm-titl";                           //! marble description of html class
  var Gmbl_ctrlModal   = "i-mm-modal";                          //! modal backgound of html class
  
  // set orientation change event
  $(window).on("orientationchange resize" ,function(){
    Gmbl_basePoint   = new Array( $(window).width()-40 , $(window).height()/2 );
    if( null != Gmbl_runMblm ) {
      Gmbl_runMblm.ttbl.initPos();
      var loop = 0;
      for( loop=0 ; loop < Gmbl_runMblm.titles.length ; loop++ ) {
        Gmbl_runMblm.titles[loop].initPos();
      }
    }
  });
  
  $.fn.marblemenu = function( args ) {
    try {
      return new MarbleMenu( $(this).selector , $.extend( args ) );
    }catch( e ) {
      alert(e.stack );
    }
  }
  
  /*** Class ***/
  /**
   * @class MarbleMenu
   * @brief menu management
   * @param tgt  : target html id name (with '#')
   * @param args : option data
   */
  function MarbleMenu( tgt , args ) {
    /* option */
    this.blur       = null;          //! blur optoin         (true/false)
    this.show_style = "";            //! show option         (DMBL_SHOWSTYLE_XXX)
    this.sel_idx    = 0;             //! select option       (marble index)
    this.titles     = new Array();   //! marble title list   (MarbleTitle)
    this.marble     = new Array();   //! marble list         (Marble)
    this.tgt_id     = tgt;           //! target id name      (# + id)
    this.intvl      = 0;             //! interval of angle   (int:60-180)
    this.ttbl       = null;          //! turn table          (TurnTable)
    this.init( args );
  }
  MarbleMenu.prototype = {
    /**
     * @brief initialize menu
     * @param marblemenu option
     * @note private function
     */
    init : function( args ) {
      $(this.tgt_id).css( "display" , "none" );
      this.setOpt( args );
      this.setMbl();
      Fmbl_initModal( this.tgt_id );
      this.ttbl = new TurnTable( this );
      $( this.marble[this.sel_idx].cont ).css( "display" , "block" );
      $( this.tgt_id ).css( "display" , "block" );
    },
    /**
     * @brief set option
     * @param marblemenu option (hash type object)
     * @note private function
     */
    setOpt : function( opt ) {
      // shading
      if ( true == ( 'blur' in opt ) ) {
        this.blur = opt['blur'];
      }else {
        this.blur = true;
      }
      // show style
      if ( true == ( 'show_style' in opt ) ) {
        this.show_style = opt['show_style'];
      }else {
        this.show_style = DMBL_SHOWSTYLE_FADE;
      }
      // default select
      if ( true == ( 'sel_idx' in opt ) ) {
        this.sel_idx = opt['sel_idx'];
      }
    },
    /**
     * @brief create Marble Object
     * @note private function
     */
    setMbl : function() {
      var elem_sel  = this.tgt_id + " > " + "." + Gmbl_classElem;
      var href_str  = null;
      var loop      = 0;
      var mcnt      = $( this.tgt_id + " > " + "." + Gmbl_classElem ).length;
      /* hide symbol,description,contents */
      for( loop=0; loop < mcnt ;loop++ ) {
        href_str = $( elem_sel + ":eq(" + loop + ")" ).attr("href");
        this.marble.push( new Marble( this , loop , href_str ) );
        this.titles.push( new MarbleTitle( this , loop ) );
      }
    },
    /**
     * @brief start menu
     * @note public function
     */
    showMenu : function() {
      // show gray filter
      if( DMBL_SHOWSTYLE_FADE == this.show_style ) {
        $( "#" + Gmbl_ctrlModal ).fadeIn( "slow" );
        // show turn table
        this.ttbl.visible(true);
      }else if( DMBL_SHOWSTYLE_SLIDE_LEFT == this.show_style ) {
        
      }else if( DMBL_SHOWSTYLE_SLIDE_RIGHT == this.show_style ) {
        
      }else {
        return;
      } 
      if( true == this.blur ) {
        // set blur
        var cont = this.marble[this.sel_idx].cont;
        $( cont ).css( "-webkit-filter" , "blur(2px)" );
        $( cont ).css( "filter"         , "blur(2px)" );
      }
      Fmbl_wakeupMarble( this );
    },
    /**
     * @brief select marble event,switch contents
     * @param idx : marble index (int)
     * @note public function
     */
    select : function( idx ) {
      var loop = 0;
      var cont = null;
      for( loop=0; loop < this.marble.length ;loop++ ) {
        if( true == this.blur ) {
          cont = this.marble[loop].cont;
          $( cont ).css( "-webkit-filter" , "blur(0px)" );
          $( cont ).css( "filter"         , "blur(0px)" );
        }
        $( cont ).css( "display" , "none" );
      }
      // show contents
      cont = this.marble[idx].cont; 
      if( DMBL_SHOWSTYLE_FADE == this.show_style ) {
        $( cont ).fadeIn("slow");
      }
      // hide menu
      this.ttbl.visible( false );
      this.titles[idx].visible( false );
      $( "#" + Gmbl_ctrlModal ).fadeOut( "slow" );
    }
  }
  
  /**
   * @class Marble
   * @brief an element of menu
   * @param pmm : parent marble menu (MarbleMenu)
   * @param idx : marble index
   * @param cont : marble contents
   * @note 
   */
  function Marble( pmm , idx , cont ) {
    this.pmm       = pmm;    //! parent MarbleMenu object
    this.index     = idx;    //! marble index
    this.angle     = 330;    //! calculate the position on the turn table
    this.cont      = cont;   //! marble contents (# + id)
    this.visible   = false;  //! show flag
    this.sym_seltr = null;   //! selector of maeble symbol
    this.init();
  }
  Marble.prototype = {
    /**
     * @brief initialize marble
     * @note private function
     */
    init    : function() {
      var elem_sel   = this.pmm.tgt_id + " > " + "." + Gmbl_classElem;
      this.sym_seltr = $( elem_sel + ":eq(" + this.index + ") > ." + Gmbl_classSymb );
      var href_str   = null;
      /* hide symbol,description,contents */
      href_str = $(elem_sel + ":eq(" + this.index + ")" ).attr("href");
      if( this.index != this.pmm.sel_idx ) {
        $( href_str ).css( "display" , "none" );
      }
      this.sym_seltr.css( "display" , "none" );
      
      /* set position */
      var pos = Fmbl_getTtblPos( this.angle , Gmbl_basePoint );
      this.sym_seltr.css( "left" , pos[0]+"px" );
      this.sym_seltr.css( "top"  , pos[1]+"px" );
    },
    /**
     * @brief visible setting
     * @param flg : visible flag (true / false)
     * @note public function
     */
    setVisible : function( flg ) {
      if( true == flg ) {
        this.sym_seltr.css( "display" , "block" );
      } else {
        this.sym_seltr.css( "display" , "none" );
        this.sym_seltr.removeClass( Gmbl_classSymb + "-unlock" );
      }
      this.visible = flg;
    },
    /**
     * @brief set marble position
     * @param ang : angle (int:0-359)
     * @note public function
     */
    setPos : function( ang ) {
      this.angle     = ang;
      var pos = Fmbl_getTtblPos( this.angle , Gmbl_basePoint );
      this.sym_seltr.css( "left" , pos[0]+"px" );
      this.sym_seltr.css( "top"  , pos[1]+"px" );
    },
    /**
     * @brief get marble position
     * @return position object\n
     *         [0] -> x position (int)
     *         [1] -> y position (int)
     * @note public function
     */
    getPos : function() {
      return Fmbl_getTtblPos( this.angle , Gmbl_basePoint );
    },
    /**
     * @brief one step move
     * @param direct : moving direction(DMBL_MOVEDIRECT_XXX)
     * @param flavor : added to the angle (int)
     * @note public function
     */
    stepMove : function( direct , flovor ) {
      var elem_sel = this.pmm.tgt_id + " > " + "." + Gmbl_classElem;
      var loop     = 0;
      if( DMBL_MOVEDIRECT_ANTICLOCK == direct ) {
        this.angle--;
        for(loop=0; loop < flovor ;loop++){
          this.angle--;
        }
        if( 0 > this.angle ) {
          this.angle = 360;
        }
      } else {
        this.angle++;
        for(loop=0; loop < flovor ;loop++){
          this.angle++;
        }
        if( 359 < this.angle ) {
          this.angle = 0;
        }
      }
      var pos = Fmbl_getTtblPos( this.angle , Gmbl_basePoint );
      this.sym_seltr.css( "left" , pos[0]+"px" );
      this.sym_seltr.css( "top"  , pos[1]+"px" );
    },
    /**
     * @brief make the border color to the selected/non-selected state
     * @param flg : select flag
     * @note public function
     */
    setSelect : function( flg ) {
      if( true == flg ) {
        this.sym_seltr.addClass( Gmbl_classSymb + "-lock" );
        this.sym_seltr.removeClass( Gmbl_classSymb + "-unlock" );
      } else {
        if( (true == this.sym_seltr.hasClass( Gmbl_classSymb + "-lock" )) ) {
          this.sym_seltr.addClass( Gmbl_classSymb + "-unlock" );
          this.sym_seltr.removeClass( Gmbl_classSymb + "-lock" );
        }
      }
    }
  }
  
  function MarbleTitle( mm , idx ) {
    this.pmm      = mm;    //! parent MarbleMenu object
    this.selector = null;
    this.init( idx );
  }
  MarbleTitle.prototype = {
    init : function( idx ) {
      var elem_sel  = this.pmm.tgt_id + " > " + "." + Gmbl_classElem;
      this.selector = $( elem_sel + ":eq(" + idx + ") > ." + Gmbl_classDesc );
      this.selector.css( "display" , "none" );
      this.initPos();
    },
    setPos : function ( xpos , ypos ) {
      this.selector.css( "top"  , xpos + "px" );
      this.selector.css( "left" , ypos + "px" );
    },
    initPos : function() {
      this.setPos( Gmbl_basePoint[1]+ 20 ,
                   $(window).width()-(40+Gmbl_ttRadius+250) );
    },
    visible : function( flg ) {
      if( true == flg ) {
        this.selector.fadeIn( "normal" );
      } else {
        this.selector.fadeOut( "normal" );
      }
    }
  }
  
  /**
   * @class TurnTable
   * @param mm : parent marble menu object
   */
  function TurnTable( mm ) {
    this.pmm        = mm;              //! parent marble menu (MarbleMenu)
    this.intvl      = 0;               //! position interval of marbles (int)
    this.html_id    = "i-mm-ttable";   //! html id name
    this.html_class = "c-mm-ttable";   //! html class name
    this.mbl_list   = null             //! managed marble list
    this.chk_cnt    = 0;               //! for move check 
    this.tchPos     = new Array(0,0);  //! touch position
    this.init();
  }
  TurnTable.prototype = {
    /**
     * @brief initialize turn table
     * @note private function
     */
    init : function() {
      $( this.pmm.tgt_id ).append("<div class='"+ this.html_class +"' id='"+ this.html_id +"1'></div>");
      $( this.pmm.tgt_id ).append("<div class='"+ this.html_class +"' id='"+ this.html_id +"2'></div>");
      $( "." + this.html_class ).css( "display"   , "none" );
      $( "." + this.html_class ).css( "position"  , "absolute" );
      $( "." + this.html_class ).css( "width"     , ( (Gmbl_ttRadius * 2) + 100 ) + "px" );
      $( "." + this.html_class ).css( "height"    , ( (Gmbl_ttRadius * 2) + 100 ) + "px" );
      $( "." + this.html_class ).css( "-webkit-border-radius" , ((( (Gmbl_ttRadius * 2) + 100)/2))+"px" );
      $( "." + this.html_class ).css( "-moz-border-radius"    , ((( (Gmbl_ttRadius * 2) + 100)/2))+"px" );
      $( "." + this.html_class ).css( "border-radius"         , ((( (Gmbl_ttRadius * 2) + 100)/2))+"px" );
      $( "." + this.html_class ).css( "text-align" , "center" );
      $( "#" + this.html_id+"1" ).css( "z-index"               , "90" );
      $( "#" + this.html_id+"1" ).css( "background-color"      , "rgb(230,210,210)" );
      $( "#" + this.html_id+"2" ).css( "z-index"               , "120" );
      $( "#" + this.html_id+"2" ).css( "background-color"      , "rgba(0,0,0,0)" );
      if( DMBL_DEVTYPE_OTHER == Gmbl_devType ) {
        $( "#" + this.html_id+"2" ).css( "cursor"   , "pointer" );
      }
      // set marble interval
      this.intvl = Math.floor( 360 / this.pmm.marble.length ) + 5;
      if( 60 > this.intvl ) {
        this.intvl = 60;
      }
      // init marble list
      this.initMblList();
      // set position
      this.initPos();
      // regist event
      this.setEvent();
    },
    initPos : function() {
      this.setPos( Gmbl_basePoint[0]-(Gmbl_ttRadius + 10) ,
                   Gmbl_basePoint[1]-(Gmbl_ttRadius + 10) );
    },
    initMblList : function(){
      this.mbl_list = null;
      this.mbl_list = new Array( this.pmm.marble.length );
      for( loop=0; loop < this.pmm.marble.length ;loop++ ) {
        this.mbl_list[loop] = null;
      }
    },
    /**
     * @brief set position
     * @param xpos : x position (int)
     * @param ypos : y position (int)
     */
    setPos : function( xpos , ypos ) {
      // set turn table position
      $( "." + this.html_class ).css( "left" , xpos + "px" );
      $( "." + this.html_class ).css( "top"  , ypos + "px" );
      // set marble position
      var loop = 0;
      for(loop=0; loop < this.mbl_list.length ;loop++) {
        if( null == this.mbl_list[loop] ) {
          continue;
        }
        this.mbl_list[loop].setPos(  this.mbl_list[loop].angle );
      }
    },
    /**
     * @brief add to managed marble list
     * @param mbl : marble object (Marble)
     * @note private function
     */
    setMarble : function( mbl ) {
      var loop = 0;
      for( loop=0; loop < this.mbl_list.length ;loop++ ){
        if( null == this.mbl_list[loop] ) {
          continue;
        }
        if( mbl.index == this.mbl_list[loop].index ) {
          return;
        }
      }
      mbl.setVisible(false);
      this.mbl_list[ mbl.index ] = mbl;
    },
    /**
     * @brief move all of the managing marbles
     * @param direct : moving direction(DMBL_MOVEDIRECT_XXX)
     * @param flavor : added to the angle (int)
     * @note public function
     */
    stepMove : function( direct , flavor ) {
      var loop = 0;
      for( loop=0 ; loop < this.mbl_list.length ; loop++ ) {
        if( (null == this.mbl_list[loop]) ||
            (false == this.mbl_list[loop].visible) ) {
          continue;
        }
        this.mbl_list[loop].stepMove( direct , flavor );
      }
      this.chk_cnt++;
    },
    /**
     * @brief effect at the time of display start
     * @param flavor : added to the angle (int)
     * @note private function
     */
    wakeupTurn : function( flavor ) {
      var loop    = 0;
      for( loop=0 ; loop < this.mbl_list.length ; loop++ ) {
        if( null == this.mbl_list[loop] ) {
          continue;
        }
        if( (310 >= this.mbl_list[loop].angle) &&
            (300 <= this.mbl_list[loop].angle) ) {
          this.mbl_list[loop].setVisible(true);
        }
        this.mbl_list[loop].stepMove( DMBL_MOVEDIRECT_ANTICLOCK , flavor );
      }
      this.chk_cnt++;
    },
    /**
     * @brief move until next marble
     * @note public function
     */
    nextMove : function() {
      var sel_idx = this.pmm.sel_idx + 1;
      if( sel_idx > (this.pmm.marble.length-1) ) {
        sel_idx = 0;
      }
      var rsv_idx = sel_idx + 1;
      if( rsv_idx > (this.pmm.marble.length-1) ) {
        rsv_idx = 0;
      }
      var out_idx = this.pmm.sel_idx - 1;
      if( 0 > out_idx ){
        out_idx = this.pmm.marble.length-1;
      }
      
      if( 1 == this.chk_cnt ) {
        if( null == this.mbl_list[rsv_idx] ) {
          this.setMarble( this.pmm.marble[rsv_idx] );
        }
        if( false == this.mbl_list[rsv_idx].visible ) {
          this.mbl_list[rsv_idx].setPos( this.mbl_list[sel_idx].angle + this.intvl );
          this.mbl_list[rsv_idx].setVisible( true );
        }
        var loop = 0;
        for( loop=0; loop < this.pmm.marble.length ;loop++ ) {
          this.pmm.marble[loop].setSelect( false );
        }
        this.pmm.marble[sel_idx].setSelect( true );
        
        this.pmm.titles[this.pmm.sel_idx].visible( false );
        this.pmm.titles[sel_idx].visible( true );
      }
      if( 180 == this.pmm.marble[sel_idx].angle ) {
        this.chk_cnt     = 0;
        this.pmm.sel_idx = sel_idx;
        this.mbl_list[out_idx].setVisible( false );
      } else {
        this.stepMove( DMBL_MOVEDIRECT_ANTICLOCK , Fmbl_getFlavor() );
      }
    },
    /**
     * @brief move until prev marble
     * @note public function
     */
    prevMove : function() {
      var sel_idx = this.pmm.sel_idx - 1;
      if( sel_idx < 0 ) {
        sel_idx = this.pmm.marble.length -1;
      }
      var rsv_idx = sel_idx - 1;
      if( 0 > rsv_idx ){
        rsv_idx = this.pmm.marble.length-1;
      }
      var out_idx = this.pmm.sel_idx + 1;
      if( out_idx > (this.pmm.marble.length-1) ) {
        out_idx = 0;
      }
      if( 1 == this.chk_cnt ) {
        if( null == this.mbl_list[rsv_idx] ) {
          this.setMarble( this.pmm.marble[rsv_idx] );
        }
        if( false == this.mbl_list[rsv_idx].visible ) {
          this.mbl_list[rsv_idx].setPos( this.mbl_list[sel_idx].angle - this.intvl );
          this.mbl_list[rsv_idx].setVisible( true );
        }
        var loop = 0;
        for( loop=0; loop < this.pmm.marble.length ;loop++ ) {
          this.pmm.marble[loop].setSelect( false );
        }
        this.pmm.marble[sel_idx].setSelect( true );
        this.pmm.titles[this.pmm.sel_idx].visible( false );
        this.pmm.titles[sel_idx].visible( true );
      }
      if( 180 == this.pmm.marble[sel_idx].angle ) {
        this.chk_cnt = 0;
        this.pmm.sel_idx = sel_idx;
        this.mbl_list[out_idx].setVisible( false );
      } else {
        this.stepMove( DMBL_MOVEDIRECT_CLOCK , Fmbl_getFlavor() );
      }
    },
    /**
     * @brief set touch,tap,mousewheel event
     * @note private function
     */
    setEvent : function() {
      if( DMBL_DEVTYPE_OTHER == Gmbl_devType ) {
        // access device is desktop pc
        var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
        $("#" + this.html_id+"2").on(mousewheelevent,function(e) {
          var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
          if (delta < 0){
            Fmbl_prevLock( true );
          } else {
            Fmbl_nextLock( true );
          }
        });
        $( "#" + this.html_id+"2" ).click( function( ev ) {
          var pos = new Array( ev.pageX , ev.pageY );
          Gmbl_runMblm.ttbl.tapTable( pos );
        })
      } else {
        $( "#" + this.html_id+"2" )[0].addEventListener("touchstart", Fmbl_tchStartEvent , false);
        $( "#" + this.html_id+"2" )[0].addEventListener("touchmove" , Fmbl_tchMoveEvent  , false);
        $( "#" + this.html_id+"2" ).on('tap', function(ev){
          var pos = new Array( ev.pageX , ev.pageY );
          Gmbl_runMblm.ttbl.tapTable( pos );
          return false;
        });


      }
    },
    /**
     * @brief tap table function
     * @param pos : tap position (index type array) \n
     *              [0] -> x position \n
     *              [1] -> y position
     * @note public function
     */
    tapTable : function( pos ) {
      var loop = 0;
      var mpos  = null;
      for(loop=0 ; loop < this.mbl_list.length ;loop++ ) {
        if( null == this.mbl_list[loop] ) {
          continue;
        }
        if( true == this.mbl_list[loop].visible ) {
          mpos = this.mbl_list[loop].getPos();
          if( 80 < ( pos[0] - mpos[0] ) ) {
            continue;
          }
          if( 80 < ( pos[1] - mpos[1] ) ) {
            continue;
          }
          if( this.pmm.sel_idx == loop ) {
            this.pmm.select( loop );
          }
        }
      }
    },
    /**
     * @brief set visible turn table
     * @param visible flag (true/false)
     * @note public function
     */
    visible : function( flg ) {
      if( true == flg ) {
        $( "." + this.html_class ).fadeIn( "slow" );
      } else {
        var loop = 0;
        for(loop=0; loop< this.mbl_list.length ;loop++) {
          if( null == this.mbl_list[loop] ) {
            continue;
          }
          if( true == this.mbl_list[loop].visible ) {
            this.mbl_list[loop].setVisible( false );
          }
        }
        $( "." + this.html_class ).fadeOut( "normal" );
      }
    }
  }
  /*** function ***/
  /**
   * @brief get type of accessed device
   * @return device type (DMBL_DEVTYPE_XXX)
   */
  function Fmbl_getDevType() {
    var user_dev = window.navigator.userAgent.toLowerCase();    
    if( (( user_dev.indexOf("windows") != -1 ) && ( user_dev.indexOf("touch") != -1 )) ||
         ( user_dev.indexOf("ipad") != -1 ) ||
        (( user_dev.indexOf("android") != -1 ) && ( user_dev.indexOf("mobile") == -1 )) ||
        (( user_dev.indexOf("firefox") != -1 ) && ( user_dev.indexOf("tablet") != -1 )) ||
         ( user_dev.indexOf("kindle") != -1 ) ||
         ( user_dev.indexOf("silk") != -1 ) ||
         ( user_dev.indexOf("playbook") != -1 ) ) {
      return DMBL_DEVTYPE_TABLET;
    }
    else if ( ( user_dev.indexOf("iphone") != -1 ) ||
              ( user_dev.indexOf("ipod") != -1 ) ) {
      return DMBL_DEVTYPE_MBLAPPLE;
    }else if ( (( user_dev.indexOf("windows") != -1 ) && ( user_dev.indexOf("phone") != -1 ))  ||
               (( user_dev.indexOf("android") != -1 ) && ( user_dev.indexOf("mobile") != -1 )) ||
               (( user_dev.indexOf("firefox") != -1 ) && ( user_dev.indexOf("mobile") != -1 )) ||
                ( user_dev.indexOf("blackberry") != -1 ) ) {
      return DMBL_DEVTYPE_MBLOTHER;
    } else {
      return DMBL_DEVTYPE_OTHER;
    }
  }
  
  /**
   * @brief add tag for modal filter
   * @param tgt : target id name (# + string)
   */
  function Fmbl_initModal( tgt ) {
    $( tgt ).append("<div id='" + Gmbl_ctrlModal + "'></div>");
    
    $( "#" + Gmbl_ctrlModal ).css( "z-index"          , "1" );
    $( "#" + Gmbl_ctrlModal ).css( "display"          , "none" );
    $( "#" + Gmbl_ctrlModal ).css( "position"         , "fixed" );
    $( "#" + Gmbl_ctrlModal ).css( "top"              , "0" );
    $( "#" + Gmbl_ctrlModal ).css( "left"             , "0" );
    $( "#" + Gmbl_ctrlModal ).css( "width"            , "100%" );
    $( "#" + Gmbl_ctrlModal ).css( "height"           , "120%" );
    $( "#" + Gmbl_ctrlModal ).css( "background-color" , "rgba(200,200,200,0.40)" );
  }
  
  /**
   * @brief effect at the time of display start
   * @param mm : marble menu object (MarbleMenu)
   */
  function Fmbl_wakeupMarble( mm ) {
    var mcnt      = Math.floor( 180 / mm.ttbl.intvl );
    var mbl_cnt   = mm.marble.length;
    var median    = Math.floor( mcnt / 2 );
    var set_idx   = mm.sel_idx - median;
    if( set_idx < 0 ) {
      set_idx = mm.marble.length + set_idx;
    }
    mm.ttbl.initMblList();
    var loop      = 0;
    var angle     = 0;
    for( loop=0 ; loop < mcnt ; loop++ ) {
      if( set_idx > mm.marble.length-1 ) {
        set_idx = 0;
      }
      angle = ( mm.ttbl.intvl * loop ); //- (mm.ttbl.intvl * median);
      if( 0 > angle ) {
        angle = 360 + ( mm.ttbl.intvl * loop ) - (mm.ttbl.intvl * median);
      }
      mm.marble[set_idx].setPos( Math.floor( angle ) );
      mm.ttbl.setMarble( mm.marble[set_idx] );
      set_idx++;
    }
    
    for(loop=0; loop < mm.marble.length ;loop++){
      mm.marble[loop].setSelect( false );
      mm.marble[loop].setVisible( false );
    }
    mm.marble[mm.sel_idx].setSelect( true );
    
    mm.titles[mm.sel_idx].visible( true );
    
    Gmbl_runMblm = mm;
    setTimeout( function(){Fmbl_wakeupEffect();},100 );
    
  }
  
  /**
   * @brief effect at the time of display start (core function)
   */
  function Fmbl_wakeupEffect() {
    var chkcnt = 0;
    var flavor = Fmbl_getFlavor();
    var chkcnt = (180 + Gmbl_runMblm.ttbl.intvl) / (flavor+1) ;
    
    if( chkcnt >= Gmbl_runMblm.ttbl.chk_cnt ) {
      Gmbl_runMblm.ttbl.wakeupTurn( flavor );
      setTimeout( function(){Fmbl_wakeupEffect();},1 );
      return;
    }
    Gmbl_runMblm.ttbl.chk_cnt = 0;
  }
  
  /**
   * @brief get marble speed
   * @return angle flavor (int)
   */
  function Fmbl_getFlavor() {
    var flavor = 0;
    if( DMBL_DEVTYPE_TABLET == Gmbl_devType ) {
      flavor = 5;
    }else if( DMBL_DEVTYPE_MBLAPPLE == Gmbl_devType ) {
      flavor = 2;
    }else if( DMBL_DEVTYPE_MBLOTHER == Gmbl_devType ) {
      flavor = 3;
    }else{
      flavor = 1;
    }
    return flavor;
  }
  
  /**
   * @brief calculate position on turn table
   * @param ang : angle
   * @return positon \n
   *         [0] -> x position \n
   *         [1] -> y position
   */
  function Fmbl_getTtblPos( ang , bpos ) {
    var ret_val = new Array();
    ret_val.push( Gmbl_ttRadius * Math.cos( ang / 180 * Math.PI ) + bpos[0] );
    ret_val.push( Gmbl_ttRadius * Math.sin( ang / 180 * Math.PI ) + bpos[1] );
    return ret_val;
  }
  
  /**
   * @brief touch start event
   * @param ev : event paramater
   */
  function Fmbl_tchStartEvent( ev ) {
    ev.preventDefault();
    var tch = ev.touches[0];
    Gmbl_runMblm.ttbl.tchPos[0] = tch.pageX;
    Gmbl_runMblm.ttbl.tchPos[1] = tch.pageY;
    Gmbl_tapChkPos[0] = tch.pageX;
    Gmbl_tapChkPos[1] = tch.pageY;
  }
  
  /**
   * @brief touch move event
   * @param ev : event paramater
   */
  function Fmbl_tchMoveEvent( ev ) {
    ev.preventDefault();
    var tch    = ev.touches[0];
    var flavor = 0;
    
    /* ignore small swiping */
    if( 3 > Math.abs( Gmbl_runMblm.ttbl.tchPos[1] - tch.pageY ) ) {
      Gmbl_runMblm.ttbl.tchPos[0] = tch.pageX;
      Gmbl_runMblm.ttbl.tchPos[1] = tch.pageY;
      return;
    }
    if( 0 != Gmbl_runMblm.ttbl.chk_cnt ) {
      /* redundant turn */
      Gmbl_runMblm.ttbl.tchPos[0] = tch.pageX;
      Gmbl_runMblm.ttbl.tchPos[1] = tch.pageY;
      return;
    }
    
    if( Gmbl_runMblm.ttbl.tchPos[1] > tch.pageY ) {
      Fmbl_prevLock( true );
    } else {
      Fmbl_nextLock( true );
    }
    Gmbl_runMblm.ttbl.tchPos[0] = tch.pageX;
    Gmbl_runMblm.ttbl.tchPos[1] = tch.pageY; 
  }
  
  /**
   * @brief scratch turn table to the anticlock direction
   * @param flg : first flag (true / false)
   */
  function Fmbl_nextLock( flg ) {
    if( true == flg ) {
      Gmbl_runMblm.ttbl.chk_cnt = 1;
    }
    if( 0 != Gmbl_runMblm.ttbl.chk_cnt ) {
      Gmbl_runMblm.ttbl.nextMove();
      setTimeout( function(){ Fmbl_nextLock( false ); },1 );
    }
  }
  /**
   * @brief scratch turn table to the clock direction
   * @param flg : first flag (true / false)
   */
  function Fmbl_prevLock( flg ) {
    if( true == flg ) {
      Gmbl_runMblm.ttbl.chk_cnt = 1;
    }
    if( 0 != Gmbl_runMblm.ttbl.chk_cnt ) {
      Gmbl_runMblm.ttbl.prevMove();
      setTimeout( function(){ Fmbl_prevLock( false ); },1 );
    }
  }
  
})(jQuery);

/* end of file */
