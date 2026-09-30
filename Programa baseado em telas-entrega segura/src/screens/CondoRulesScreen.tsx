import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { EmptyState } from '../components/ui/EmptyState';
import {
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  ShieldIcon,
  TruckIcon,
} from '../components/ui/Icons';
import { formatHour, formatWeekdays } from '../utils/formatters';

export function CondoRulesScreen() {
  const { actions, condominium } = useApp();

  if (!condominium) {
    return (
      <Shell nav>
        <PageHeader title="Regras do condomínio" onBack={() => actions.navigate('profile')} />
        <ScrollArea>
          <EmptyState
            title="Condomínio não identificado"
            subtitle="Faça login para ver as regras do seu condomínio."
          />
        </ScrollArea>
      </Shell>
    );
  }

  const rules = [
    {
      icon: <ClockIcon size={22} />,
      title: 'Horário de funcionamento',
      text: `Entregas e serviços das ${formatHour(condominium.allowedHours.start)} às ${formatHour(
        condominium.allowedHours.end
      )}.`,
    },
    {
      icon: <CalendarIcon size={22} />,
      title: 'Dias permitidos',
      text: `${formatWeekdays(condominium.allowedDays)}. Fora desses dias a portaria não libera entregas internas.`,
    },
    {
      icon: <TruckIcon size={22} />,
      title: 'Entregas',
      text: 'A entrega é feita diretamente entre moradores, no hall do bloco ou na porta do apartamento, dentro dos horários permitidos.',
    },
    {
      icon: <CalendarIcon size={22} />,
      title: 'Serviços',
      text: 'Agendamento obrigatório. O prestador deve informar data e horário previamente combinados com o morador.',
    },
    {
      icon: <ShieldIcon size={22} />,
      title: 'Convivência',
      text: 'É proibida a venda de bebidas alcoólicas a menores, produtos ilícitos e qualquer atividade que gere ruído fora do horário de silêncio.',
    },
    {
      icon: <BuildingIcon size={22} />,
      title: 'Responsabilidade',
      text: 'O condomínio não é parte das transações. Cada morador é responsável pela qualidade do que anuncia e pelo cumprimento do combinado.',
    },
  ];

  return (
    <Shell nav>
      <PageHeader
        eyebrow={condominium.name}
        title="Regras do condomínio"
        subtitle={condominium.address}
        onBack={() => actions.navigate('profile')}
      />
      <ScrollArea className="px-4 py-4 md:px-6">
        <div className="mx-auto grid w-full max-w-[900px] gap-3 md:grid-cols-2">
          {rules.map((rule) => (
            <article
              key={rule.title}
              className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1D4ED8]">
                {rule.icon}
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900">{rule.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{rule.text}</p>
              </div>
            </article>
          ))}
        </div>
      </ScrollArea>
    </Shell>
  );
}
