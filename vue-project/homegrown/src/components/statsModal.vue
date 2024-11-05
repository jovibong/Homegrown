<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container p-5">
                <div class="modal-header">
                    <slot name="header">{{ title }}</slot>
                </div>

                










                <div class="mb-4">
                    <form class="needs-validation" novalidate>
                        <label for="statEditable" class="form-label">{{ statNonEditable }}</label>
                        <input type="text" class="form-control" id="statEditable" :value="statEditable" readonly required>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                    </form>
                </div>
                <div class="mb-4">
                    <form class="needs-validation" novalidate>
                        <label for="descriptionEditable" class="form-label">{{ descriptionNonEditable }}</label>
                        <input type="text" class="form-control" id="descriptionEditable" :value="descriptionEditable" readonly required>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button class="modal-default-button" @click="$emit('close')">OK</button>
                </div>












            </div>
        </div>
    </Transition>
</template>

<script setup>
import { watch } from 'vue';
const { show, title, statNonEditable, statEditable, descriptionNonEditable, descriptionEditable } = defineProps({
    show: Boolean,
    title: String,
    statNonEditable: String,
    statEditable: [String, Number, Date],
    descriptionNonEditable: String,
    descriptionEditable: [String, Number, Date],
});

watch(() => [title, statNonEditable, statEditable, descriptionNonEditable, descriptionEditable], (newValues) => {
    console.log('this is modal');
    console.log('Updated tile props:', newValues);
}, { immediate: true }); // Logs the values 
</script>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
    display: flex;
    transition: opacity 0.3s ease;
}

.modal-container {
    margin: auto;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}

.modal-header h3 {
    margin-top: 0;
}

.modal-default-button {
    float: right;
}

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(2);
}
</style>
