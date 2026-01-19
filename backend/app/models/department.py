from datetime import datetime
import uuid

from app.extensions import db


class Department(db.Model):
    __tablename__ = "departments"
    __table_args__ = (
        db.UniqueConstraint(
            "organization_id",
            "name",
            name="uq_department_org_name"
        ),
    )

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), default="default")

    organization_id = db.Column(
        db.String(36),
        db.ForeignKey("organizations.id"),
        nullable=False
    )

    owner_id = db.Column(db.String(36), nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self, include_stats: bool = False) -> dict:
        data = {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "organization_id": self.organization_id,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "is_default": self.type == "default",
            "is_custom": self.type == "custom",
        }

        if include_stats:
            data["critical_signals"] = 0

        return data
