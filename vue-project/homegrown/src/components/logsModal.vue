<script setup>
const { show} = defineProps({
    show: Boolean,
});
</script>

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container p-5">
                <div class="modal-header">
                    <slot name="header">this is header default </slot>
                </div>

                <div class="mb-4">
                    <form class="needs-validation" novalidate>
                        
                            <label for="validationCustom01" class="form-label"></label>
                            <input type="text" class="form-control" id="validationCustom01" value="stat" required>
                            <div class="valid-feedback">
                                Looks good!
                            </div>
                        
                    </form>
                </div>

                <div class="modal-footer">
                    <p>this is footer</p>
                    <button class="modal-default-button" @click="$emit('close')">OK</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

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

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

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