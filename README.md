## Marblemenu
A menu for all kind of websites.  
Marblemenu displayed in some circles the menu.  
User selects slide the circle.  

## How to
### Quick start

**html**  

    <div id="id_name">
      <div class="c-mm-elem" href="#conts-home">
        <div class="c-mm-symb">
          <i class="fa fa-home fa-3x"></i> <!-- icon or image -->
        </div>
      <div class="c-mm-title">home</div>
        :
    </div>
    <div class="c-conts" id="conts-home">
      <!-- contents -->
    </div>

require class name "c-mm-elem","c-mm-symb","c-mm-title"  
require id name to each tag for contents,specipy "href" to corresponding "c-mm-elem".  

**javascript**  

    var marble = $("#id_name").marblemenu();
    marble.showMenu();

### Options
| key   | value            | description            |
|:------|:-----------------|:-----------------------|
|sel_idx| int:marble index | Specified marbles is displayed in a state where the selection.<br>default is 0. |
|blur   | bool:true/false  | Bulr the background when the menu is displayed.<br>default is true.| 

    // example
    $("#id_name").marblemenu({sel_idx:1});

### Functions
| name     | param  | description            |
|:---------|:-------|:-----------------------|
| showMenu | (none) | show menu              |



### Dependencies
- jQuery  
- jQuery mobile

## To do
- settable color option  
- settable show style(fade,slide_left,slide_right)

## License
MIT License  
http://opensource.org/licenses/MIT
