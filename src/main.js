var prodList, sel, addBtn, cartDisp, sum, stockInfo
var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0

// 메인
function main() {
  // 상품 리스트
  // q는 재고량을 의미. 0인 경우는 품절된 상품
  prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ]

  // 돔 조작 변수들
  var root = document.getElementById('app')
  let cont = document.createElement('div')
  var wrap = document.createElement('div')
  let hTxt = document.createElement('h1')

  // 돔 조작 박스들
  cartDisp = document.createElement('div')
  sum = document.createElement('div')
  sel = document.createElement('select')
  addBtn = document.createElement('button')
  stockInfo = document.createElement('div')

  // 여기서는 각 요소에 ID값 부여
  cartDisp.id = 'cart-items'
  sum.id = 'cart-total'
  sel.id = 'product-select'
  addBtn.id = 'add-to-cart'
  stockInfo.id = 'stock-status'

  // 클래스 네임 정하기
  cont.className = 'bg-gray-100 p-8'
  wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
  hTxt.className = 'text-2xl font-bold mb-4'
  sum.className = 'text-xl font-bold my-4'
  sel.className = 'border rounded p-2 mr-2'
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded'
  stockInfo.className = 'text-sm text-gray-500 mt-2'

  // 제목, 버튼 라벨 텍스트
  hTxt.textContent = '장바구니'
  addBtn.textContent = '추가'

  // 셀렉트 박스( 상품 선택 옵션)들을 업데이트 합니다
  updateSelOpts()

  // wrap으로 자식 DOM 요소들 업데이트
  // 아마 이벤트가 일어났을 때, 바인딩되는 것 같다.
  wrap.appendChild(hTxt)
  wrap.appendChild(cartDisp)
  wrap.appendChild(sum)
  wrap.appendChild(sel)
  wrap.appendChild(addBtn)
  wrap.appendChild(stockInfo)
  cont.appendChild(wrap)
  root.appendChild(cont)
  // calcCart는 초기 총액 계산을 위한 함수
  calcCart()

  setTimeout(function () {
    // setInterval로 반복적인 작업 수행
    setInterval(function () {
      // luckyItem 은 prodList 길이만큼 랜덤을 돌려 상품 선택
      var luckyItem = prodList[Math.floor(Math.random() * prodList.length)]
      // 30% 확률로 재고가 있는 상품 할인 (luckyItem.q 는 재고)
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        // 상품의 가격을 20% 할인
        luckyItem.val = Math.round(luckyItem.val * 0.8)
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!')
        // 상품 가격 변경 시 셀렉트 박스 옵션을 업데이트
        // 번개세일이나 기타 할인으로 인해 상품 가격이 변동되었을 때
        // 가격이 변경되면 그 변동을 반영
        updateSelOpts()
      }
      // 30초 마다 실행
    }, 30000)
    // 처음 실행까지 ~10 초 사에 랜덤 지연시간
  }, Math.random() * 10000)

  // 2초 뒤 추천상품 권장 기능, 1분마다 실행된다.
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        var suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.q > 0
        })

        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!')
          // 5% 할인 적용
          suggest.val = Math.round(suggest.val * 0.95)

          // 상품이 추천되면 선택 옵션 업데이트
          updateSelOpts()
        }
      }

      //60초 뒤
    }, 60000)
    // ~ 20초 랜덤 지연시간
  }, Math.random() * 20000)
}

// 셀렉트 박스 옵션 업데이트
function updateSelOpts() {
  // innerHTTML를 비워서 옵션들을 새로 추가함 (초깃값)
  sel.innerHTML = ''
  // prodList의 item을 순회하며
  prodList.forEach(function (item) {
    // 옵션을 DOM에 생성
    var opt = document.createElement('option')
    // 옵션의 value는 상품 id
    opt.value = item.id

    // 상품 이름과 가격을 표시
    opt.textContent = item.name + ' - ' + item.val + '원'
    // 재고가 없으면 선택 불가능
    if (item.q === 0) opt.disabled = true
    // 옵션을 셀렉트 박스에 추가
    sel.appendChild(opt)
  })
}

// 카트 총합 계산
function calcCart() {
  totalAmt = 0
  itemCnt = 0
  // 카트 안의 아이템들 가져오기
  var cartItems = cartDisp.children
  var subTot = 0
  for (var i = 0; i < cartItems.length; i++) {
    ;(function () {
      var curItem
      for (var j = 0; j < prodList.length; j++) {
        // 장바구니 아이템 = 상품 리스트 매칭
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j]
          break
        }
      }

      // x 를 기준으로 문자열을 나눠서, 나눈 후 두 번째 값인 수량 부분을 선택한 다음, 이를 숫자로 변환해 q에 저장
      var q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1])

      // 가격 x 수량
      var itemTot = curItem.val * q
      var disc = 0
      // 아이템 개수 누적
      itemCnt += q
      // 각 아이템별 가격 총합
      subTot += itemTot

      // 할인 조건. 10개 이상 구매 시 상품에 따라 할인이 적용
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1
        else if (curItem.id === 'p2') disc = 0.15
        else if (curItem.id === 'p3') disc = 0.2
        else if (curItem.id === 'p4') disc = 0.05
        else if (curItem.id === 'p5') disc = 0.25
      }
      // 총합에 할인을 적용한 값을 추가
      // 총합 totalAmt에 각 상품의 할인 적용 후 가격을 누적
      // itemTot는 해당 상품의 총 가격이고, disc는 할인율
      totalAmt += itemTot * (1 - disc)
    })()
  }

  let discRate = 0
  // 대량 구매 할인 조건 (30개 이상 구매 시 25% 할인)
  if (itemCnt >= 30) {
    // bulkDisc -> 25% 할인
    // totalAmt ->  할인 후 총합
    var bulkDisc = totalAmt * 0.25
    // itemDisc -> 상품 개별 할인이 적용된 가격과 대량 구매 할인을 비교할 때
    // subTot -> 상품별 총 가격의 누적 합계
    var itemDisc = subTot - totalAmt
    // 25% 할인이 더 크면 적용
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25)
      discRate = 0.25
    } else {
      discRate = (subTot - totalAmt) / subTot
    }
  } else {
    discRate = (subTot - totalAmt) / subTot
  }

  // 화요일에 추가 10% 할인
  if (new Date().getDay() === 2) {
    // 10% 추가 할인
    totalAmt *= 1 - 0.1
    // 할인율 중 최대값 적용
    discRate = Math.max(discRate, 0.1)
  }

  // 총액을 화면에 표시
  sum.textContent = '총액: ' + Math.round(totalAmt) + '원'
  if (discRate > 0) {
    var span = document.createElement('span')
    span.className = 'text-green-500 ml-2'
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)'
    // 총액을 나타내는 sum 요소에 할인율을 표시하는 span을 추가
    // span 요소는 총액 옆에 추가로 붙어서 할인율을 표시
    sum.appendChild(span)
  }

  // 재고 상태 업데이트
  updateStockInfo()
  // 보너스 포인트 업데이트
  renderBonusPts()
}

// 보너스 포인트 계산
const renderBonusPts = () => {
  // 총액 1000원 당 1포인트 적립
  bonusPts += Math.floor(totalAmt / 1000)
  // 적립 포인트를 표시할 span 요소를 찾는다
  var ptsTag = document.getElementById('loyalty-points')
  // 없을 경우 새로 생성
  if (!ptsTag) {
    ptsTag = document.createElement('span')
    ptsTag.id = 'loyalty-points'
    ptsTag.className = 'text-blue-500 ml-2'
    sum.appendChild(ptsTag)
  }
  // 포인트 화면에 표시
  ptsTag.textContent = '(포인트: ' + bonusPts + ')'
}

// 재고 정보 업데이트
function updateStockInfo() {
  var infoMsg = ''
  prodList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg += item.name + ': ' + (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') + '\n'
    }
  })
  // 재고 부족, 품절된 상품 정보를 표시
  stockInfo.textContent = infoMsg
}

// 여기서 메인을 렌더링하고
main()

// 상품 추가 버튼 클릭 이벤트
addBtn.addEventListener('click', function () {
  // 선택한 상품의 ID
  var selItem = sel.value
  // 상품 리스트에서 선택한 상품 찾기
  var itemToAdd = prodList.find(function (p) {
    return p.id === selItem
  })
  // itemToAdd.id 로 item이라는 변수를 만들고,
  if (itemToAdd && itemToAdd.q > 0) {
    // 이미 장바구니에 있는지 확인
    var item = document.getElementById(itemToAdd.id)
    // item이 있다면
    if (item) {
      // 수량 1 증가
      var newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1
      // newQty가  itemToAdd.q 보다 작을 때 일어나는 조건
      // itemToAdd.q -> 해당 상품의 재고 수량
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty
        // 재고 1 감소
        itemToAdd.q--
      } else {
        alert('재고가 부족합니다.')
      }
      // item이 없다면
    } else {
      var newItem = document.createElement('div')
      newItem.id = itemToAdd.id
      newItem.className = 'flex justify-between items-center mb-2'
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.val +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>'
      // 장바구니에 추가
      cartDisp.appendChild(newItem)
      // 재고 1 감소
      itemToAdd.q--
    }

    // 총액 및 할인 계산
    calcCart()
    // 마지막 선택한 상품 저장
    lastSel = selItem
  }
})

// 장바구니 내 수량 변경 및 삭제 이벤트
cartDisp.addEventListener('click', function (event) {
  var tgt = event.target

  // quantity-change, remove-item 클래스명을 가지고 있는지
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    // dataset -> data- 속성 값을 자바스크립트에서 접근할 수 있게 해주는 객체
    var prodId = tgt.dataset.productId
    // 장바구니 내 상품 요소 찾기
    var itemElem = document.getElementById(prodId)
    // 상품 리스트에서 해당 상품 찾기
    var prod = prodList.find(function (p) {
      return p.id === prodId
    })

    if (tgt.classList.contains('quantity-change')) {
      // dataset.change -> data-change 속성 값을 읽어온다.
      var qtyChange = parseInt(tgt.dataset.change)
      // 현재 수량에 qtyChange를 더하여 새 수량을 계산
      // qtyChange 증감값 - , +
      var newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange
      // newQty는 장바구니에 있는 수량보다 많지않고, 재고(prod.q)와 비교하여 증가할 수 있다.
      if (newQty > 0 && newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty
        // 재고 수량 조정
        prod.q -= qtyChange
      } else if (newQty <= 0) {
        // 수량이 0 이하일 경우 장바구니에서 제거
        itemElem.remove()
        prod.q -= qtyChange
      } else {
        alert('재고가 부족합니다.')
      }
    } else if (tgt.classList.contains('remove-item')) {
      var remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      // 삭제할 상품의 재고 복구
      prod.q += remQty
      // 상품 삭제
      itemElem.remove()
    }

    // 계산 다시 실행
    calcCart()
  }
})
