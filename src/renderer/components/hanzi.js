//

import { EventBus } from './bus.js'
import {log, q} from '../utils'
import _ from 'lodash'

let fs = require('fs');
let path = require('path');

let paths = [
  'M 468 731 Q 484 715 502 693 Q 514 680 529 680 Q 539 680 545 693 Q 549 706 543 735 Q 539 751 515 762 Q 460 783 444 779 Q 440 775 440 763 Q 443 753 468 731 Z',
  'M 688 798 Q 670 767 618 695 Q 608 677 626 681 Q 644 693 734 754 Q 753 772 778 783 Q 800 795 787 813 Q 772 829 745 844 Q 720 857 706 854 Q 693 853 697 838 Q 701 819 688 798 Z',
  'M 580 599 Q 754 638 759 642 Q 766 649 763 657 Q 756 667 730 675 Q 702 679 675 669 Q 621 650 564 636 Q 500 621 424 614 Q 391 608 415 593 Q 454 572 515 586 Q 525 589 538 590 L 580 599 Z',
  'M 500 468 Q 537 498 563 524 Q 579 540 589 549 Q 596 556 593 570 Q 587 588 580 599 L 538 590 Q 511 515 381 420 Q 375 417 374 411 Q 373 407 378 407 Q 403 404 474 449 L 500 468 Z',
  'M 597 383 Q 552 443 500 468 L 474 449 Q 480 446 491 435 L 539 392 Q 549 380 561 366 L 596 308 Q 641 236 604 91 Q 594 54 583 50 Q 574 46 515 54 Q 473 63 472 56 Q 471 49 483 35 Q 543 -14 567 -48 Q 580 -67 597 -64 Q 616 -61 633 -36 Q 678 51 670 196 Q 658 274 647 299 L 597 383 Z',
  'M 491 435 Q 490 434 490 431 Q 480 371 348 259 Q 330 246 353 249 Q 416 256 514 363 Q 529 381 539 392 L 491 435 Z',
  'M 561 366 Q 557 363 553 354 Q 498 216 335 77 Q 322 62 332 61 Q 353 52 424 101 Q 490 146 559 245 Q 590 288 590 291 Q 594 300 596 308 L 561 366 Z',
  'M 623 363 Q 654 381 752 445 Q 773 461 799 473 Q 821 483 811 503 Q 796 522 768 538 Q 743 553 729 550 Q 716 549 719 534 Q 723 510 653 423 Q 632 402 609 374 L 623 363 Z',
  'M 647 299 Q 785 170 818 163 Q 876 156 979 181 Q 997 185 998 190 Q 999 197 985 201 Q 796 258 779 267 Q 772 271 766 274 Q 708 302 623 363 L 609 374 Q 603 378 597 383 L 647 299 Z'
]


export default {
  name: 'hanzi',
  created () {
    // EventBus.$on('show-recursive', data => {
      // log('=== hanzi-recu', data)
    // })
    EventBus.$on('show-hanzi', doc => {
      this.showHanzi(doc)
    })
    // EventBus.$on('show-hanzi', data => {
      // log('HANZI VUE')
    // })
  },
  data: function () {
    return {
      paths: paths,
      hanzi: {pinyin: []}
    }
  },
  methods: {
    showHanzi: function (doc) {
      log('IPC SVG', doc)
      // this.paths = doc.strokes
      this.hanzi = doc

      // let hanzipath = path.join(__dirname, './hanzi.svg');
      // let html = fs.readFileSync(hanzipath,'utf8').trim();

      // // let svg = require('./hanzi.svg')
      // // log('== svg', svg)
      // var parser = new DOMParser();
      // var doc = parser.parseFromString(html, "image/svg+xml");
      // let el = q('#hanzi')
      // // el.appendChild(doc)
      // // error on line 1 at column 1: Document is empty

      // el.appendChild(
      //   el.ownerDocument.importNode(doc.documentElement, true)
      // )
      // frame.innerHTML = svg
      // this.svg = svg
    }
  }
}

let drawSVG = function(svgStr) {
  var parser = new DOMParser();
  var dom = parser.parseFromString(svgStr, "text/xml");
  document.getElementById('hanzi').appendChild(dom.documentElement);
}