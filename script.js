document.addEventListener('DOMContentLoaded', function() {
    const introScene = document.getElementById('intro-scene');
    const scenes = [
        document.getElementById('update-scene'),
        document.getElementById('lore-scene'),
        document.getElementById('final-scene')
    ];
    const gnb = document.querySelector('.gnb');
    const gnbLinks = document.querySelectorAll('.gnb-link');
    let currentSceneIndex = -1; // -1은 인트로 장면을 의미
    let isAnimating = false; // 애니메이션 중복 실행 방지 플래그

    // --- 1. 초기 인트로 애니메이션 처리 ---
    setTimeout(() => {
        introScene.style.opacity = '0';
        introScene.style.pointerEvents = 'none';

        // 인트로가 사라진 후 첫 번째 장면으로 전환
        setTimeout(() => {
            changeScene(0);
        }, 1500); // 인트로 사라지는 시간과 동일
    }, 7000); // 7000 밀리초 = 7초 (text-2 애니메이션 시작 5초 + 지속 2초)

    // --- 2. 장면 전환 함수 ---
    function changeScene(newIndex, isGnbClick = false) {
        if (isAnimating || newIndex === currentSceneIndex) return;
        isAnimating = true;

        const oldIndex = currentSceneIndex;
        currentSceneIndex = newIndex;

        // GNB 가시성 제어: 인트로(-1)가 아닐 때만 GNB를 보여줌
        if (currentSceneIndex >= 0) {
            gnb.style.opacity = '1';
        }

        // GNB 활성화 상태 업데이트
        gnbLinks.forEach(link => link.classList.remove('active'));
        if (gnbLinks[currentSceneIndex]) {
            gnbLinks[currentSceneIndex].classList.add('active');
        }

        // 이전 장면 숨기기
        if (oldIndex !== -1) {
            scenes[oldIndex].style.opacity = '0';
            scenes[oldIndex].style.pointerEvents = 'none';
            scenes[oldIndex].querySelectorAll('.reveal-on-scroll, .difficulty-image').forEach(el => el.classList.remove('is-visible'));
        }

        // 새 장면 보이기
        scenes[currentSceneIndex].style.opacity = '1';
        scenes[currentSceneIndex].style.pointerEvents = 'auto';

        // --- 장면별 애니메이션 처리 확장 ---
        const currentScene = scenes[currentSceneIndex];
        const sceneId = currentScene.id;

        // GNB 클릭 시 모든 요소를 바로 표시
        if (isGnbClick) {
            currentScene.querySelectorAll('.reveal-on-scroll, .difficulty-image').forEach(el => el.classList.add('is-visible'));
            if (sceneId === 'final-scene') {
                currentScene.querySelector('.final-text-container').style.display = 'none';
                currentScene.querySelector('.difficulty-container').style.opacity = '1';
            }
            isAnimating = false; // GNB 클릭 시 애니메이션 대기 시간 없음
            return;
        }

        // 휠 스크롤 시 순차 애니메이션 적용
        if (sceneId === 'update-scene') {
            const character = currentScene.querySelector('.character-image');
            const contents = currentScene.querySelectorAll('.content-wrapper .reveal-on-scroll');
            character.classList.add('is-visible');
            setTimeout(() => {
                contents.forEach((el, index) => {
                    setTimeout(() => el.classList.add('is-visible'), index * 300);
                });
            }, 800);
        } else if (sceneId === 'lore-scene') {
            const texts = currentScene.querySelectorAll('.lore-container .reveal-on-scroll');
            const character = currentScene.querySelector('.character-image-right');
            texts.forEach((el, index) => {
                setTimeout(() => el.classList.add('is-visible'), index * 1000);
            });
            setTimeout(() => character.classList.add('is-visible'), texts.length * 1000);
        } else if (sceneId === 'final-scene') {
            const textContainer = currentScene.querySelector('.final-text-container');
            const difficultyContainer = currentScene.querySelector('.difficulty-container');
            const texts = currentScene.querySelectorAll('.final-text');
            const difficulties = currentScene.querySelectorAll('.difficulty-image');

            textContainer.style.display = 'block'; // 텍스트 컨테이너 다시 보이게
            texts.forEach(el => el.classList.add('is-visible'));
            setTimeout(() => { textContainer.style.display = 'none'; }, 4000);
            setTimeout(() => {
                difficultyContainer.style.opacity = '1';
                difficulties.forEach((el, index) => { setTimeout(() => el.classList.add('is-visible'), index * 400); });
            }, 4500);
        }

        // 애니메이션 시간 후 플래그 해제
        setTimeout(() => { isAnimating = false; }, 1800);
    }

    // --- 3. 이벤트 리스너 설정 ---
    // 마우스 휠로 장면 전환
    window.addEventListener('wheel', (event) => {
        if (currentSceneIndex < 0) return;
        const direction = event.deltaY > 0 ? 'down' : 'up';
        if (direction === 'down' && currentSceneIndex < scenes.length - 1) {
            changeScene(currentSceneIndex + 1);
        } else if (direction === 'up' && currentSceneIndex > 0) {
            changeScene(currentSceneIndex - 1);
        }
    });

    // GNB 클릭으로 장면 전환
    gnbLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetIndex = parseInt(e.target.dataset.sceneIndex, 10);
            changeScene(targetIndex, true); // GNB 클릭임을 알리는 플래그 전달
        });
    });
});