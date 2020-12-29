
jest.mock('../../src/conversation/lobby/entity');
jest.mock('../../src/conversation/event-store');

jest.mock('../../src/conversation/entered');
jest.mock('../../src/conversation/exited');

import EventStore from '../../src/conversation/event-store';
import Agent from '../../src/conversation/agent/entity';
import Lobby from '../../src/conversation/lobby/entity';
import Entered from '../../src/conversation/entered';
import Exited from '../../src/conversation/exited';
import AgentNotInLobby from '../../src/conversation/agent-not-in-lobby';
import AgentAlreadyInLobby from '../../src/conversation/agent-already-in-lobby';
import Validator from '../../src/conversation/validator';
import AgentValidator from '../../src/conversation/agent/agent-validator';

beforeEach(function () {
  (Lobby as any).mockClear();
  (EventStore as any).mockClear();
  (Entered as any).mockClear();
  (Exited as any).mockClear();
});

describe('agent', function () {
  let eventStore: any;
  let lobby: any;
  let validator: Validator = new AgentValidator();

  beforeEach(function () {
    new EventStore();
    eventStore = (EventStore as any).mock.instances[0];
    new Lobby(eventStore);
    lobby = (Lobby as any).mock.instances[0];
  });

  describe('if not in lobby', function () {
    test('cannot exit lobby', function () {
      expect(() => {
        eventStore.process_events = jest.fn(() => {
          agent.remove(lobby);
        });
        
        const agent = new Agent(eventStore, validator);
        agent.exit(lobby);

        expect(eventStore.publish).toHaveBeenCalledTimes(1);
        expect(eventStore.publish).toHaveBeenCalledWith((Exited as any).mock.instances[0]);
        expect(eventStore.process_events).toHaveBeenCalledTimes(1);
      }).toThrow(AgentNotInLobby);
    });

    test('can enter lobby', function () {
      eventStore.process_events = jest.fn(function () {
        agent.add(lobby);
      });
      
      const agent = new Agent(eventStore, validator);
      lobby.agents = [agent];
      
      agent.enter(lobby);
      expect(agent.valid()).toBeTruthy();
    });
  });

  describe('if in lobby', function () {
    test('cannot enter lobby', function () {
      expect(() => {
        eventStore.process_events = jest.fn(() => {
          agent.add(lobby);
        });
        
        const agent = new Agent(eventStore, validator);
        agent.add(lobby);
        agent.enter(lobby);

        expect(eventStore.publish).toHaveBeenCalledTimes(1);
        expect(eventStore.publish).toHaveBeenCalledWith((Entered as any).mock.instances[0]);
        expect(eventStore.process_events).toHaveBeenCalledTimes(1);
      }).toThrow(AgentAlreadyInLobby);
    });
    test('can exit lobby', function () {
      eventStore.process_events = jest.fn(function () {
        agent.remove(lobby);
      });
      
      const agent = new Agent(eventStore, validator);
      agent.add(lobby);
      lobby.agents = [];
      
      agent.exit(lobby);
      expect(agent.valid()).toBeTruthy();
    });
  });
});