// components/AboutPm.tsx
type TeamMember = {
  role: string;
  name: string;
  contribution: string;
};

const team: TeamMember[] = [
  {
    role: "Project Lead",
    name: "Bishal Neupane",
    contribution: "Data pipeline & model integration",
  },
  {
    role: "Frontend Specialist",
    name: "Munna Pajiyar",
    contribution: "User interface & experience design",
  },
  {
    role: "Backend Specialist",
    name: "Neesha Basnet",
    contribution: "API development & data management",
  },
  {
    role: "UI Developer",
    name: "Sujal Khand Thakuri",
    contribution: "Web deployment & user interface",
  },
];

export default function Innovators() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">🌟 Meet the Innovators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {team.map((member) => (
          <div key={member.name} className="rounded-2xl shadow-md hover:shadow-lg transition p-4">
            <h3 className="text-xl font-semibold">{member.role}</h3>
            <p className="text-lg text-gray-800">{member.name}</p>
            <p className="text-gray-600">{member.contribution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
