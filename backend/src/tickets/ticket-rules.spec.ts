import { statusTransition } from './ticket-rules.js';

const now = new Date('2026-10-03T10:00:00Z');

describe('statusTransition', () => {
  it('закрытие заявки фиксирует дату и отмечает проверку скважины', () => {
    expect(statusTransition('IN_PROGRESS', 'DONE', now)).toEqual({ resolvedAt: now, markWellChecked: true });
  });

  it('переоткрытие сбрасывает дату закрытия', () => {
    expect(statusTransition('DONE', 'NEW', now)).toEqual({ resolvedAt: null, markWellChecked: false });
  });

  it('перенос между открытыми колонками ничего не меняет', () => {
    expect(statusTransition('NEW', 'IN_PROGRESS', now)).toEqual({ markWellChecked: false });
  });

  it('тот же статус — без изменений', () => {
    expect(statusTransition('DONE', 'DONE', now)).toEqual({ markWellChecked: false });
  });
});
