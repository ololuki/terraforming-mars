import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {ResourceType} from '../../ResourceType';
import {Player} from '../../Player';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {MoonCards} from '../../moon/MoonCards';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';

export class NanotechIndustries extends Card implements IActionCard, CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.NANOTECH_INDUSTRIES,
      tags: [Tags.SCIENCE, Tags.MOON],
      startingMegaCredits: 42,
      resourceType: ResourceType.SCIENCE,
      initialActionText: 'Draw 3 cards and keep 2.',

      metadata: {
        cardNumber: 'MC1',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).cards(3).minus().cards(1).br;
          b.action('Add 1 science resource to ANY card [except those giving 2 or more VP per 1 science resource.]', (eb) => {
            eb.empty().startAction.science(1).asterix();
          });
        }),
        description: 'You start with 42 M€. As your first action, draw 3 cards. Take 2 of them into hand, and discard the rest. ' +
          '1 VP for every 2 science resources here.',
        victoryPoints: CardRenderDynamicVictoryPoints.science(1, 2),
      },
    });
  }

  public resourceCount = 0;

  public play() {
    return undefined;
  }

  public initialAction(player: Player): PlayerInput {
    return player.drawCardKeepSome(3, {keepMax: 2});
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(
      player,
      ResourceType.SCIENCE,
      {filter: (card): boolean => MoonCards.scienceCardsWithLessThan2VP.has(card.name)},
    ));
    return undefined;
  }

  public getVictoryPoints() {
    return Math.floor(this.resourceCount / 2);
  }
}
