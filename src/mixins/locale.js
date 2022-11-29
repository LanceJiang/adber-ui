import { t } from '@adber/adber-ui/src/locale'
export default {
  methods: {
    t(...args) {
      return t.apply(this, args)
    }
  }
}
