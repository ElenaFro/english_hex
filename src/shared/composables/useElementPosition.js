import { ref, onMounted, onUnmounted } from 'vue';

export function useElementPosition(elementRef, options = {}) {
    const { autoUpdate = false, delay = 0, watchResize = false, watchScroll = false } = options;

    const position = ref({ top: 0, left: 0, width: 0, height: 0 });
    const isCalculating = ref(false);

    const calculatePosition = () => {
        if (!elementRef?.value) return null;

        const el = elementRef.value;
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        position.value = {
            top: Math.round(rect.top + scrollTop),
            left: Math.round(rect.left + scrollLeft),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
        };

        return position.value;
    };

    const calculatePositionDelayed = () => {
        if (delay > 0) {
            setTimeout(calculatePosition, delay);
        } else {
            calculatePosition();
        }
    };

    const getPositionStyle = (adjustments = {}, unit = 'px') => {
        const { top = 0, left = 0, width = 0, height = 0 } = adjustments;

        return {
            top: position.value.top + top + unit,
            left: position.value.left + left + unit,
            width: position.value.width + width + unit,
            height: position.value.height + height + unit,
        };
    };

    const handleResize = () => {
        calculatePositionDelayed();
    };

    const handleScroll = () => {
        calculatePositionDelayed();
    };

    if (autoUpdate) {
        onMounted(() => {
            calculatePositionDelayed();

            if (watchResize) {
                window.addEventListener('resize', handleResize);
            }

            if (watchScroll) {
                window.addEventListener('scroll', handleScroll);
            }
        });

        onUnmounted(() => {
            if (watchResize) {
                window.removeEventListener('resize', handleResize);
            }

            if (watchScroll) {
                window.removeEventListener('scroll', handleScroll);
            }
        });
    }

    return {
        position,
        calculatePosition,
        calculatePositionDelayed,
        getPositionStyle,
        isCalculating,
    };
}
