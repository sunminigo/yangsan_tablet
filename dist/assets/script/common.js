jQuery.browser = {};
(function () {
  jQuery.browser.msie = false;
  jQuery.browser.version = 0;
  if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
    jQuery.browser.msie = true;
    jQuery.browser.version = RegExp.$1;
  }
})();


$(function() {
  let Accordion = function(el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;

    let links = this.el.find('.link');
    let links2 = this.el.find('.links2');
    let menus = links.next().find('.item');

    links.on('click', {
      el: this.el,
      multiple: this.multiple,
      sub: false
    }, this.dropdown)
    links2.on('click', {
      el: this.el,
      multiple: this.multiple,
      sub: true
    }, this.dropdown)
    menus.on('click', {
      el: this.el,
      links: links
    }, this.selectItem);
  }

  Accordion.prototype.selectItem = function (e) {
    let subAcc = $(this).parents()

    if (subAcc.hasClass('toggle')) {
      console.log(1111)
      $('#selectTime').text($(this).text());

      let selectDate = $("#selectDay").text();

    } else {
      console.log(222)
      $(this).parents('li').find('.text').addClass('select-txt').html(()=>{
        if ($(this).parents('li')[0].dataset.menu) {          
          return `${$(this).parents('li')[0].dataset.menu} <span class="text--point">${$(this).text()}</span>`
        }
        return `<span class="text--point">${$(this).text()}</span>`
      })
      $(this).parent().slideUp().parent().removeClass('open');
      $(this).parents('li').next().addClass('open').find('.submenu').slideDown();
    }
  }
  Accordion.prototype.dropdown = function(e) {
    let $el = e.data.el,
        $this = $(this),
        $next = $this.next();
    if (e.data.sub) {
      $next.slideDown();
    } else {
      $next.slideToggle();
      $this.parent().toggleClass('open');
    }

    if (!e.data.sub && !e.data.multiple) {
      $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
    };
    if (e.data.sub && !e.data.multiple) {
      $el.find('.toggle').not($next).slideUp();
    };
  }

  let accordion = new Accordion($('#accordion'), false);
  let subAccordion = new Accordion($('#sub-accordion'), false);
});

/* Calendar */
$('#datepicker').datepicker({
  dateFormat: "yy.mm.dd",
  showOn: true,
  showOtherMonths: true,
  selectOtherMonths: true,
  showMonthAfterYear: true,
  gotoCurrent: true,
  yearSuffix: '???',
  dayNames: ['?????????', '?????????', '?????????', '?????????', '?????????', '?????????', '?????????'],
  dayNamesMin: ['???', '???', '???', '???', '???', '???', '???'],
  monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
  monthNames: ['1???','2???','3???','4???','5???','6???','7???','8???','9???','10???','11???','12???'],
  minDate: 0,
  maxDate: "+30D",
  onSelect:function(d){
    let arr = d.split(".");

    $("#year").text(arr[0]);
    $("#month").text(arr[1]);
    $("#day").text(arr[2]);

    //?????? ????????????
    //???????????? ?????? ???????????? (????????? ?????????)
    let date = new Date($("#datepicker").datepicker({dateFormat:"yy.mm.dd"}).val());
    let week = new Array("???","???","???","???","???","???","???");

    $('#date').html(`<span class="text--point">?????? ${week[date.getDay()]}??????, ???1???<br> 10:00~12:00/4??? ??????</span>`);
    $('#selectDay').html(`?????? ${week[date.getDay()]}??????, ???1??? 10:00~12:00/4??? ??????`);

    // $('.calendar-box').slideToggle(500);

    // $('.accordion-list li').removeClass('open');
  }
});
