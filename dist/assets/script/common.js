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
      $('#selectTime').text($(this).text());

      let selectDate = $("#selectDay").text();
      let selectTime = $("#selectTime").text();

      $('#dateTime').addClass('select-txt').text(`${selectDate} ${selectTime}`);
      $('.time-box').slideUp();
    } else {
      $(this).parents('li').find('.text').addClass('select-txt').text($(this).text())
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
  showOtherMonths: true,
  selectOtherMonths: true,
  showMonthAfterYear: true,
  gotoCurrent: true,
  yearSuffix: '년',
  dayNames: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
  dayNamesMin: ['월', '화', '수', '목', '금', '토', '일'],
  monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  minDate: 0,
  maxDate: "+30D",
  onSelect:function(d){
    let arr = d.split(".");

    $("#year").text(arr[0]);
    $("#month").text(arr[1]);
    $("#day").text(arr[2]);

    //요일 가져오기
    //데이터를 먼저 가져오고 (숫자로 넘어옴)
    let date = new Date($("#datepicker").datepicker({dateFormat:"yy.mm.dd"}).val());
    let week = new Array("일","월","화","수","목","금","토");
    let selectTime = $("#selectTime").text();

    $("#selectDay").text(`${d} (${week[date.getDay()]})`);

    if (selectTime.indexOf('선택') === -1) {
      $('#dateTime').addClass('select-txt').text(`${d} (${week[date.getDay()]}) ${selectTime}`)
    }
    $('.calendar-box').slideUp(500);
    $('.time-box').slideDown(500);
  }
});
